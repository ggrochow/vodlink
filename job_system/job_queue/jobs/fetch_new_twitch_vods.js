const Job = require('./job');
const twitchApi = require('../../../external_apis/twitch');
const db = require('../../../database');
const jobTypes = require('../job_types');
const moment = require('moment');

/**
 * Job to find all new twitch vods for a channel
 *
 * PAYLOAD: {
 *     twitchChannelId:
 *     cursor: *OPTIONAL*
 * }
 * twitchChannelId: database id of twitch channel
 * cursor: api pagination cursor, optionally included if a single api query doesn't return all vods
 *
 * If any new vods are found, creates a FetchLolMatchesDuringVod job for EACH summoner account associated with the channel
 * Since our jobs are limited to 1 API query per job, we need a multiple jobs if multiple summoners exist
 */
class FetchNewTwitchVodsJob extends Job {

    get twitchChannelId() {
        return this.payload.twitchChannelId;
    }

    get cursor() {
        return this.payload.cursor;
    }

    async run() {
        // Get Channel info from our database
        let twitchChannel;
        try {
            twitchChannel = await db.twitchAccounts.getById(this.twitchChannelId);
        } catch (sqlError) {
            this.errors = `Error retrieving twitch account info from DB - ${sqlError.message}`;
            this.logErrors();
            console.error(sqlError);
            return this;
        }

        if (twitchChannel === undefined) {
            this.errors = `No twitch_account with id: ${this.twitchChannelId} found in our DB`;
            this.logErrors();
            return this;
        }

        let nativeChannelId = twitchChannel.native_channel_id;
        let apiResult;

        // API query to find archive of vods for channel
        try {
            apiResult = await twitchApi.getVodsForChannel(nativeChannelId, this.cursor);
        } catch (apiError) {
            if (apiError.statusCode === 429 || apiError.statusCode >= 500) {
                this.setToRetry();
                return this;
            }

            this.errors = `Error retrieving vods from twitch API - ${apiError.message}`;
            this.logErrors();
            console.error(apiError);
            return this;
        }

        // If we hit the max page size, create another FETCH_NEW_TWITCH_VODS job with cursor info.
        if (apiResult.data.length === 100) {
            let payload = {
                cursor: apiResult.pagination.cursor,
                twitchChannelId: this.twitchChannelId,
            };

            try {
                await db.jobs.createNewJob(jobTypes.FETCH_NEW_TWITCH_VODS, payload);
            } catch (sqlError) {
                this.errors = `Error while creating fetchNewTwitchVods job with pagination cursor - ${sqlError.message}`;
                this.logErrors();
                console.error(sqlError);
                return this;
            }
        }

        if (apiResult.data.length === 0) {
            return this;
        }

        // Get list of known vod Ids
        let nativeVodIdsInDatabase;
        try {
            nativeVodIdsInDatabase = await db.twitchVods.getAllNativeVodIdsByTwitchChannelId(this.twitchChannelId);
            nativeVodIdsInDatabase = nativeVodIdsInDatabase.map(res => res.native_vod_id);
        } catch (sqlError) {
            this.errors = `Error while fetching known vodIds from database - ${sqlError.message}`;
            this.logErrors();
            console.error(sqlError);
            return this;
        }

        let lolSummoners;
        try {
            lolSummoners = await db.lolSummoners.getAllByTwitchId(this.twitchChannelId);
        } catch (sqlError) {
            this.errors = `Error while fetching summoner accounts from database - ${sqlError.message}`;
            this.logErrors();
            console.error(sqlError);
            return this;
        }
        // For each job, if its new, public, and created within the last month,
        // create DB entry then foreach lol account associated - a new FIND_LOL_MATCHES_DURING_VOD job.
        let oneMonthAgo = moment().subtract(1, 'month');
        for (let vodIndex in apiResult.data) {
            let vodInfo = apiResult.data[vodIndex];

            if (vodInfo.viewable !== 'public') {
                continue;
            }

            let nativeVodId = vodInfo.id;
            if (nativeVodIdsInDatabase.includes(nativeVodId)) {
                continue;
                // TODO: look into why this might still allow for duplicate vodId
            }

            let startTime = moment.utc(vodInfo.created_at);
            if (startTime < oneMonthAgo) {
                continue;
            }

            let endTime = calculateVodEndTime(vodInfo.duration, vodInfo.created_at);
            // Create vod in DB
            let twitchVod;
            try {
                twitchVod = await db.twitchVods.createNew(startTime, endTime, this.twitchChannelId, nativeVodId);
            } catch (sqlError) {
                this.errors = `Error while creating twich_vod - ${sqlError.message}`;
                this.logErrors();
                console.error(sqlError);
                return this;
            }

            // Create a look at vods job for each summoner account associated
            for (let summonerIndex in lolSummoners) {
                let summonerAccount = lolSummoners[summonerIndex];

                try {
                    let payload = {
                        twitchVodId: twitchVod.id,
                        summonerId: summonerAccount.id
                    };
                    await db.jobs.createNewJob(jobTypes.FETCH_LOL_MATCHES_DURING_VOD, payload)
                } catch (sqlError) {
                    this.errors = `Error while creating FETCH LOL MATCH JOB - ${sqlError.message}`;
                    this.logErrors();
                    console.error(sqlError);
                    return this;
                }
            }

        }

        return this;
    }
}

function calculateVodEndTime(durationString, startedAt) {
    let iso8601Duration = `PT${durationString.toUpperCase()}`;
    let duration = moment.duration(iso8601Duration);

    let startTime = moment.utc(startedAt);
    return startTime.add(duration);
}


module.exports = FetchNewTwitchVodsJob;

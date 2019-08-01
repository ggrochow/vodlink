const Job = require('./job');
const twitchApi = require('../../external_apis/twitch');
const db = require('../../database');
const jobTypes = require('../job_types');
const moment = require('moment');

class FetchNewTwitchVodsJob extends Job {

    get twitchChannelId() {
        return this.payload.twitchChannelId;
    }

    get cursor() {
        return this.payload.cursor;
    }



    async run() {
        // Get Channel info from our database
        debugger;
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
        debugger
        if (apiResult.data.length === 0) {
            return this;
        }

        // Get list of known vod Ids
        let nativeVodIdsInDatabase;
        try {
            nativeVodIdsInDatabase = await db.twitchVods.getAllNativeVodIdsByTwitchChannelId(this.twitchChannelId);
            nativeVodIdsInDatabase.map(res => res.native_vod_id.toString());
        } catch (sqlError) {
            this.errors = `Error while fetching known vodIds from database - ${sqlError.message}`;
            this.logErrors();
            console.error(sqlError);
            return this;
        }

        // For each job,
        // if its new, public, and not older than a month,
        // create DB entry, and new FIND_LOL_MATCHES_DURING_VOD job.
        let oneMonthAgo = moment().subtract(1, 'month').toDate();
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

            let startTime = new Date(vodInfo.created_at);
            if (startTime < oneMonthAgo) {
                continue;
            }

            let endTime = calculateVodEndTime(vodInfo.duration, vodInfo.created_at);

            let twitchVod;
            try {
                twitchVod = await db.twitchVods.createNew(startTime, endTime, this.twitchChannelId, nativeVodId);
            } catch (sqlError) {
                this.errors = `Error while creating twich_vod - ${sqlError.message}`;
                this.logErrors();
                console.error(sqlError);
                return this;
            }

            try {
                let payload = { twitchVodId: twitchVod.id };
                await db.jobs.createNewJob(jobTypes.FETCH_LOL_MATCHES_DURING_VOD, payload)
            } catch (sqlError) {
                this.errors = `Error while creating twich_vod - ${sqlError.message}`;
                this.logErrors();
                console.error(sqlError);
                return this;
            }
        }

        return this;
    }
}

function calculateVodEndTime(durationString, startedAt) {
    let iso8601Duration = `PT${durationString.toUpperCase()}`;
    let duration = moment.duration(iso8601Duration);

    let startTime = moment.utc(startedAt);
    return startTime.add(duration).toDate();
}


module.exports = FetchNewTwitchVodsJob;

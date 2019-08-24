const Job = require('./job');
const lolApi = require('../../../external_apis/lol');
const db = require('../../../database');
const jobTypes = require('../job_types');

/**
 * Job to lookup a summoner by name & region, If found associate it to the provided channel
 *
 * PAYLOAD: {
 *     summonerName:
 *     summonerRegion:
 *     twitchChannelId:
 * }
 * summonerName: name of summoner to lookup info on
 * summonerRegion: region that the summoner account is on
 * twitchChannelId: database id of twitch channel to associate summoner with
 *
 * After successful association, create a FetchNewTwitchVods job for the associated channel.
 * fetchNewTwitchVods jobs here since this is only ran when making new accounts, so we have new data to check against
 */
class FetchLolSummonerIdJob extends Job {

    get accountRegion() {
        return this.payload.summonerRegion;
    }

    get accountName() {
        return this.payload.summonerName;
    }

    get twitchChannelId() {
        return this.payload.twitchChannelId;
    }

    async run() {
        let apiResult;
        try {
            apiResult = await lolApi.getAccountInfoFromSummonerName(this.accountRegion, this.accountName);
        } catch (apiError) {
            if (apiError.statusCode === 429 || apiError.statusCode >= 500) {
                this.setToRetry();
                return this;
            }

            this.errors = `error while fetching summoner account info - ${apiError.message}`;
            this.logErrors();
            return this;
        }

        if (apiResult === undefined || apiResult.accountId === undefined) {
            // no results found?
            this.errors = `No Summoner account found with this name/region combo`;
            this.logErrors();
            return this;
        }
        let nativeSummonerId = apiResult.accountId;
        let summonerName = apiResult.name;

        try {
            await db.lolSummoners.createNewLolSummoner(nativeSummonerId, summonerName, this.accountRegion, this.twitchChannelId);
        } catch (sqlError) {
            // TODO: testing
            this.errors = `SQL error creating summoner account -  ${sqlError.message}`;
            this.logErrors();
            console.error(sqlError);
            return this;
        }


        try {
            let payload = { twitchChannelId : this.twitchChannelId };
            await db.jobs.createNewJob(jobTypes.FETCH_NEW_TWITCH_VODS, payload);
        } catch (sqlError) {
            this.errors = `SQL error creating ${jobTypes.FETCH_NEW_TWITCH_VODS} job`;
            this.logErrors();
            console.error(sqlError);
        }

        return this;
    }
}

module.exports = FetchLolSummonerIdJob;

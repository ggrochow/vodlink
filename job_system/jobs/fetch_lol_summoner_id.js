const logger = require('../../utils/logger');
const Job = require('./job');
const lolApi = require('../../external_apis/lol');
const db = require('../../database');
const jobTypes = require('../job_types');

// {"summonerName": "VoyBoy", "summonerRegion": "NA", "twitchChannelId": 14}
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
        logger.verbose(`${this.logPrefix()} starting run`);

        let apiResult;
        try {
            apiResult = await lolApi.getAccountInfoFromSummonerName(this.accountRegion, this.accountName);
        } catch (apiError) {
            // TODO: testing
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

        logger.verbose(`${this.logPrefix()} found summoner info, native id - ${nativeSummonerId}`);

        try {
            await db.lolSummoners.createNewLolSummoner(nativeSummonerId, this.accountName, this.accountRegion, this.twitchChannelId);
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

        logger.verbose(`${this.logPrefix()} completed`);
        return this;
    }
}

module.exports = FetchLolSummonerIdJob;

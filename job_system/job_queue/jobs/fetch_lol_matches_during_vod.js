const Job = require('./job');
const logger = require('../../../utils/logger');
const lolApi = require('../../../external_apis/lol');
const db = require('../../../database');
const jobTypes = require('../job_types');

/**
 * Job to find a list of all lol_matches played by a streamer during a given twitch vod
 *
 * PAYLOAD: {
 *     twitchVodId:
 *     summonerId:
 * }
 * twitchVodId: database id of twitch vod
 * summonerId: database id of summoner account
 *
 *
 * If we find any matches, create a new FetchLoLMatchInfo job for each
 */
class FetchLolMatchesDuringVodJob extends Job {

    get twitchVodId() {
        return this.payload.twitchVodId;
    }

    get lolSummonerId() {
        return this.payload.summonerId;
    }

    async run() {
        let twitchVod;
        try {
            twitchVod = await db.twitchVods.getById(this.twitchVodId);
        } catch (sqlError) {
            this.errors = `Error fetching twitch vod from database - ${sqlError.message}`;
            this.logErrors();
            console.error(sqlError);
            return this;
        }

        let lolSummoner;
        try {
            lolSummoner = await db.lolSummoners.getById(this.lolSummonerId)
        } catch (sqlError) {
            this.errors = `Error fetching twitch vod from database - ${sqlError.message}`;
            this.logErrors();
            console.error(sqlError);
            return this;
        }

        let startTime = twitchVod.started_at.valueOf();
        let endTime = twitchVod.ended_at.valueOf();

        let apiResults;
        try {
            apiResults = await lolApi.getMatchesForAccountInPeriod(lolSummoner.region, lolSummoner.native_summoner_id, startTime, endTime);
        } catch (apiError) {
            if (apiError.statusCode === 429 || apiError.statusCode >= 500) {
                this.setToRetry();
                return this;
            }

            if (apiError.statusCode === 404) {
                // 404 is returned if no results are found
                logger.verbose(`${this.logPrefix()} got 404 while searching for games, assuming that means none found for this vod`);
                return this;
            }

            this.errors = `Error fetching lol matchlist from API - ${apiError.message}`;
            this.logErrors();
            console.error(apiError);
            return this;
        }

        for (let matchIndex in apiResults.matches) {
            let lolMatch = apiResults.matches[matchIndex];

            try {
                let payload = {
                    nativeMatchId: lolMatch.gameId,
                    region: lolSummoner.region,
                };
                await db.jobs.createNewJob(jobTypes.FETCH_LOL_MATCH_INFO, payload)
            } catch (sqlError) {
                this.errors = `Error saving FETCH MATCH INFO job - ${sqlError}`;
                this.logErrors();
                console.error(sqlError);
                return this;
            }
        }


        return this;
    }

}

module.exports = FetchLolMatchesDuringVodJob;

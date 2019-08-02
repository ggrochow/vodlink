const Job = require('./job');
const lolApi = require('../../external_apis/lol');
const db = require('../../database');
const jobTypes = require('../job_types');

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

        let startTime = twitchVod.started_at.getTime();
        let endTime = twitchVod.ended_at.getTime();

        let apiResults;
        try {
            apiResults = await lolApi.getMatchesForAccountInPeriod(lolSummoner.region, lolSummoner.native_summoner_id, startTime, endTime);
        } catch (apiError) {
            this.errors = `Error fetching lol matchlist from API - ${apiError.message}`;
            this.logErrors();
            console.error(apiError);
            return this;
        }

        if (apiResults.matches.length === 0) {
            return this;
        }

        for (let matchIndex in apiResults.matches) {
            let lolMatch = apiResults.matches[matchIndex];

            try {
                let payload = { nativeMatchId: lolMatch.gameId };
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

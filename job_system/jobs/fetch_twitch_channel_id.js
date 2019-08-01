const twitchApi = require('../../external_apis/twitch');
const jobTypes = require("../job_types");
const Job = require("./job");
const db = require('../../database');

class FetchTwitchChannelIdJob extends Job {

    get channelName() {
        return this.payload.twitchName;
    }

    get lolAccounts() {
        return this.payload.lolAccounts
    }

    async run() {
        let apiResult;
        try {
            apiResult = await twitchApi.getUserInfoFromChannelName(this.channelName);
        } catch (apiError) {
            // TODO testing
            this.errors = `error while fetching twitch channel info - ${apiError.message}`;
            this.logErrors();
            console.error(apiError);
            return this;
            // Set relevant errors on job, return it.
        }

        if (apiResult === undefined || apiResult.data.length === 0 || apiResult.data[0].id === undefined) {
            // No results found for name, error this
            this.errors = `No twitch channel with the username ${this.channelName} found via twitchapi`;
            this.logErrors();
            return this;
        }

        let nativeTwitchId = apiResult.data[0].id;

        let twitchAccount;
        try {
            twitchAccount = await db.twitchAccounts.createNew(this.channelName, nativeTwitchId);
        } catch (sqlErr) {
            // TODO: testing
            this.errors = `SQL error while saving twitch account - ${sqlErr.message}`;
            this.logErrors();
            console.error(sqlErr);
            return this;
        }

        const twitchChannelId = twitchAccount.id;
        for (let lolAccountInfo of this.lolAccounts) {
            let payload = {
                twitchChannelId,
                summonerName: lolAccountInfo.name,
                summonerRegion: lolAccountInfo.region,
            };

            try {
                await db.jobs.createNewJob(jobTypes.FETCH_LOL_SUMMONER_ID, payload);
            } catch (sqlErr) {
                // do we rollback if it doesnt work? idk
                // TODO: testing
                this.errors = `SQL error saving ${jobTypes.FETCH_LOL_SUMMONER_ID} job, ${sqlErr.message}`;
                this.logErrors();
                console.error(sqlErr);
                return this;
            }
        }

        return this;

    }

}

module.exports = FetchTwitchChannelIdJob;
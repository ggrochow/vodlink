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
        console.log(`Job - ${this.shortName} starting run`);
        let apiResult;

        try {
            apiResult = await twitchApi.getUserInfoFromChannelName(this.channelName);
        } catch (apiError) {
           this.errors = `error while fetching twitch channel info - ${apiError.message}`;
            console.error(apiError.message);
            console.error(this.errors);
            console.error(apiError);
            return this;
            // Set relevant errors on job, return it.
        }

        if (apiResult === undefined || apiResult.data.length === 0 || apiResult.data[0].id === undefined) {
            // No results found for name, error this.
            this.errors = `No twitch channel with the username ${this.channelName} found via twitchapi`;
            console.error(this.errors);
            return this;
        }

        let nativeTwitchId = apiResult.data[0].id;
        console.log(`Job - ${this.shortName} found native twitch ID for ${this.channelName} - id: ${nativeTwitchId} `);

        let twitchAccount;
        try {
            twitchAccount = await db.twitchAccounts.createNewTwitchAccount(this.channelName, nativeTwitchId);
        } catch (sqlErr) {
            this.errors = `SQL error while saving twitch account - ${sqlErr.message}`;
            console.error(sqlErr.message);
            console.error(this.errors);
            console.error(sqlErr);
            return this;
        }

        console.log(`Job - ${this.shortName} inserted twitch_account with ID - ${twitchAccount.id}`);

        const twitchChannelId = twitchAccount.id;
        for (let lolAccountInfo of this.lolAccounts) {
            let payload = {
                twitchChannelId,
                summonerName: lolAccountInfo.name,
                summonerRegion: lolAccountInfo.region,
            };

            try {
                console.log(`Job - ${this.shortName} creating new ${jobTypes.FETCH_LOL_SUMMONER_ID} job for summoner ${lolAccountInfo.name} on ${lolAccountInfo.region} region`);
                await db.jobs.createNewJob(jobTypes.FETCH_LOL_SUMMONER_ID, payload);
            } catch (sqlErr) {
                // do we rollback if it doesnt work? idk
                this.errors = `SQL error saving ${jobTypes.FETCH_LOL_SUMMONER_ID} job, ${sqlErr.message}`;
                console.error(sqlErr.message);
                console.error(this.errors);
                console.error(sqlErr);
                return this;
            }
        }

        console.log(`Job - ${this.shortName} completed`);
        return this;

    }

}

module.exports = FetchTwitchChannelIdJob;
const twitchApi = require('../../../external_apis/twitch');
const jobTypes = require("../job_types");
const Job = require("./job");
const db = require('../../../database');

/**
 * Finds native id for a twitch channel by name
 *
 * PAYLOAD: {
 *     twitchName:
 *     lolAccounts: [
 *          { name: , region: }
 *     ]
 * }
 * twitchName: name of the twitch channel to lookup
 * lolAccounts: array of objects with a name&region field containing information on this channels summoner account(s)
 *
 * Creates a FetchLolSummonerId job for each object in the lolAccounts array.
 */
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
            if (apiError.statusCode === 429 || apiError.statusCode >= 500) {
                this.setToRetry();
                return this;
            }

            this.errors = `error while fetching twitch channel info - ${apiError.message}`;
            console.error(apiError);
            return this;
            // Set relevant errors on job, return it.
        }

        if (apiResult === undefined || apiResult.data.length === 0 || apiResult.data[0].id === undefined) {
            // No results found for name, error this
            this.errors = `No twitch channel with the username ${this.channelName} found via twitchapi`;
            return this;
        }

        let nativeTwitchId = apiResult.data[0].id;
        let twitchName = apiResult.data[0].display_name;

        let twitchAccount;
        try {
            twitchAccount = await db.twitchAccounts.createNew(twitchName, nativeTwitchId);
        } catch (sqlErr) {
            this.errors = `SQL error while saving twitch account - ${sqlErr.message}`;
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
                this.errors = `SQL error saving ${jobTypes.FETCH_LOL_SUMMONER_ID} job, ${sqlErr.message}`;
                console.error(sqlErr);
                return this;
            }
        }

        return this;

    }

}

module.exports = FetchTwitchChannelIdJob;
const twitchApi = require('../../external_apis/twitch');

class FetchTwitchChannelIdJob {

    jobRows = {};

    constructor(jobRows) {
        this.jobRows = jobRows;
    }

    get payload() {
        return this.jobRows.payload;
    }
    get channelName() {
        return this.payload.twitch_name;
    }

    handleApiError(e) {
        // check status code,
        // if 429 ( rate limit hit ) set job to retry.
        // set job to error.
    }

    handleSQLerror(e) {
        // set to error,
    }

    run() {
        let request = twitchApi.getUserInfoFromChannelName(this.channelName)
            .then(res => {
                let id = res.data[0].id;
                // Create `twitch_channel` entry in Db
                // .then
                // create `FIND_LOL_ACCOUNT_BY_NAME` job for each lol account.
            })
            .catch(this.handleApiError);
    }
}

module.exports = FetchTwitchChannelIdJob;
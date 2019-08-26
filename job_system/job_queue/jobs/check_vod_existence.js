const Job = require('./job');
const twitchApi = require('../../../external_apis/twitch');
const db = require('../../../database');

/**
 * Job to check that a vod still exists, and cleanup if its gone
 *
 * PAYLOAD: {
 *     vodId:
 * }
 * vodId: database id of twitch vod to check
 *
 * Vods expire after a certain period of time
 * Check twitch API to make sure the vod still exists, If it doesn't we delete it.
 * When deleting vods, also delete any lolMatchTwitchVod relations. Stale games will be deleted in another job
 */
class CheckVodExistenceJob extends Job {
    get vodId() {
        return this.payload.vodId;
    }

    async run() {
        let twitchVod;
        try {
            twitchVod = await db.twitchVods.getById(this.vodId);
        } catch (sqlError) {
            this.errors = `Error retrieving vod from DB - ${sqlError.message}`;
            console.error(sqlError);
            return this;
        }

        let statusCode;
        try {
            await twitchApi.getVodById(twitchVod.native_vod_id);
            statusCode = 200;
        } catch (apiError) {
            if (apiError.statusCode === 429 || apiError.statusCode >= 500) {
                this.setToRetry();
                return this;
            }

            // API returns 404 if no vod is found when ID provided.
            if (apiError.statusCode !== 404) {
                this.errors = `Error retrieving vod from api - ${apiError.message}`;
                console.error(apiError);
                return this;
            }

            statusCode = apiError.statusCode;
        }


        if (statusCode === 404) {
            try {
                await db.twitchVods.deleteById(this.vodId);
            } catch (sqlError) {
                this.errors = `Error deleting vod by id - ${sqlError.message}`;
                console.error(sqlError);
                return this;
            }
            try {
                await db.lolMatchTwitchVods.deleteByVodId(this.vodId);
            } catch (sqlError) {
                this.errors = `Error deleting lol_match_twitch_vods by vodId - ${sqlError.message}`;
                console.error(sqlError);
                return this;
            }
        }

        return this;
    }
}

module.exports = CheckVodExistenceJob;
const db = require('../../../database');
const jobTypes = require('../../job_queue/job_types');
const logger = require('../../../utils/logger');


/**
 * Creates a new FetchNewTwitchVods job for every twitchChannel in our DB
 *
 * Interval: once per day
 */
async function createFetchNewTwitchVodsJob() {
    logger.verbose('Starting createFetchNewTwitchVodsJob for each account');

    let twitchAccounts;
    try {
        twitchAccounts = await db.twitchAccounts.getAll();
    } catch (sqlError) {
        logger.error(`createFetchNewTwitchVodsJob - Error getting all twitch accounts from DB - ${sqlError.message}`);
        return;
    }

    for (let index in twitchAccounts) {
        let twitchAccount = twitchAccounts[index];
        let payload = { twitchChannelId: twitchAccount.id };

        try {
            await db.jobs.createNewJob(jobTypes.FETCH_NEW_TWITCH_VODS, payload);
        } catch (sqlError) {
            logger.error(`createFetchNewTwitchVodsJob - Error creating new FETCH_NEW_TWITCH_VODS job for twitchAccount id: ${twitchAccount.id}`);
            return;
        }
    }

    logger.verbose(`Created ${twitchAccounts.length} FETCH_NEW_TWITCH_VODS jobs`);
}

module.exports = createFetchNewTwitchVodsJob;
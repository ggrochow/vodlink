const CronJob = require('cron').CronJob;
const createFetchNewTwitchVodsJob = require('./jobs/create_fetch_new_twitch_vods_jobs');
const createCheckVodExistenceJobs = require('./jobs/create_check_vod_existence_jobs');
const deleteFinishedJobs = require('./jobs/delete_finished_jobs');
const deleteOldLolMatches = require('./jobs/delete_old_lol_matches');

// Every day at midnight
let createFetchNewVods = new CronJob(
    '00 00 00 * * *',
    createFetchNewTwitchVodsJob,
);

// Every day at noon
let createCheckVodExistence = new CronJob(
    '00 00 12 * * *',
    createCheckVodExistenceJobs
);

// Every Monday at 5pm
let deleteFinishedJobsCron = new CronJob(
    '00 00 17 * * 1',
    deleteFinishedJobs
);

// Every Tuesday at 5pm
let deleteOldLolMatchesCron = new CronJob(
    '00 00 17 * * 2',
    deleteOldLolMatches
);

module.exports = {
    createFetchNewVods,
    createCheckVodExistence,
    deleteFinishedJobsCron,
    deleteOldLolMatchesCron,
};

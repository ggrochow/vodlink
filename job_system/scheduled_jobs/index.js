const CronJob = require('cron').CronJob;
const createFetchNewTwitchVodsJob = require('./jobs/createFetchNewTwitchVodsJobs');

// Every day at midnight
let createFetchNewVods = new CronJob(
    '00 00 00 * * *',
    createFetchNewTwitchVodsJob,
);


module.exports = {
    createFetchNewVods,
};

const JobQueue = require('./job_queue');
const jobTypes = require('../job_types');

const twitchJobTypes = [
    jobTypes.FETCH_TWITCH_CHANNEL_ID,
    jobTypes.FETCH_NEW_TWITCH_VODS,
];

// https://dev.twitch.tv/docs/api/guide/#rate-limits
// No bearer token = 30 requests per minute.
const twitchRateLimit = 2000;

let twitchJobQueue = new JobQueue(twitchJobTypes, twitchRateLimit, 'Twitch');

module.exports = {
    twitchJobQueue,
};

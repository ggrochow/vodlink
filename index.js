require('dotenv').config();
const jobQueues = require('./job_system/job_queue/');
const cronJobs = require('./job_system/scheduled_jobs');

const { twitchJobQueue, lolJobQueue, nonApiJobQueue } = jobQueues;
const { createFetchNewVods } = cronJobs;

setInterval(() => { lolJobQueue.run() },     1000);
setInterval(() => { twitchJobQueue.run() },  1000);
setInterval(() => { nonApiJobQueue.run() },  1000);
createFetchNewVods.start();

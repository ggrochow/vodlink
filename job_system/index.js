require('dotenv').config();
const jobQueues = require('./job_queue');
const cronJobs = require('./scheduled_jobs');
const logger = require('../utils/logger');

const { twitchJobQueue, lolJobQueue, nonApiJobQueue } = jobQueues;

logger.info("Initializing Job queues");
setInterval(() => { lolJobQueue.run() },     100);
setInterval(() => { twitchJobQueue.run() },  100);
setInterval(() => { nonApiJobQueue.run() },  100);

logger.info("Initializing CRON jobs");
const { createFetchNewVods, createCheckVodExistence } = cronJobs;
createFetchNewVods.start();
createCheckVodExistence.start();


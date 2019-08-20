require('dotenv').config();
const jobQueues = require('./job_system/job_queue/');
const cronJobs = require('./job_system/scheduled_jobs/');
const expressApi = require('./api/');
const logger = require('./utils/logger');

const { twitchJobQueue, lolJobQueue, nonApiJobQueue } = jobQueues;

logger.info("Initializing Job queues");
setInterval(() => { lolJobQueue.run() },     1000);
setInterval(() => { twitchJobQueue.run() },  1000);
setInterval(() => { nonApiJobQueue.run() },  1000);

logger.info("Initializing CRON jobs");
const { createFetchNewVods } = cronJobs;
createFetchNewVods.start();

logger.info("Starting express api");

let port = process.env.API_PORT;
expressApi.listen(port, () => logger.info(`api listening on ${port}`));

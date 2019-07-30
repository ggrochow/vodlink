require('dotenv').config();
const jobQueues = require('./job_system/job_runner/');


const { twitchJobQueue } = jobQueues;

twitchJobQueue.run();
// setInterval(() => { twitchJobQueue.run() }, 1000);

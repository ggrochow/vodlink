require('dotenv').config();
const jobQueues = require('./job_system/job_runner/');


const { twitchJobQueue, lolJobQueue } = jobQueues;

// twitchJobQueue.run();
// lolJobQueue.run();

setInterval(() => { lolJobQueue.run() },     1000);
setInterval(() => { twitchJobQueue.run() },  1000);

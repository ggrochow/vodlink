require('dotenv').config();
const jobQueues = require('./job_system/job_runner/');


const { twitchJobQueue, lolJobQueue } = jobQueues;

// twitchJobQueue.run();
// setInterval(() => { twitchJobQueue.run() }, 1000);


lolJobQueue.run();
// setInterval(() => twitchJobQueue.run(), 1000);

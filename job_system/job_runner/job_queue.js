const jobs = require('../jobs');
const db = require('../../database');

// Setup two queues, with different 'rate limits' to wait between each job
// Each queue will look at the database for jobs that use its API, maybe pass in a list of job types to search?

class JobQueue {

    /**
     * @param jobTypeArray {string[]} Array of jobType shortnames that this queue will run
     * @param rateLimitMs {number} Milliseconds to wait between each job
     * @param name {string} Name of queue to be used in logging
     */
    constructor(jobTypeArray, rateLimitMs, name) {
        this.timeOfLastFinishedJob = null;
        this.currentJob = null;

        this.jobTypeArray = jobTypeArray;
        this.rateLimitMs = rateLimitMs;
        this.name = name;
    }

    async runJob(jobRows) {
        console.log(`Job Queue ${this.name} starting runJob( job - ${jobRows.id} )`);

        let job = jobs.instantiateJob(jobRows);
        this.currentJob = job;

        try {
            await db.jobs.setJobToRunning(job.id);
        } catch (err) {
            // TODO
            console.error(err.message);
            console.error(err);
        }

        try {
            job = await job.run();
        } catch (err) {
            // TODO
            console.error(err.message);
            console.error(err);
            // Job should handle its own API/DB related errors, if it gets here something bad happened.
        }

        return job;
    }

    async finishJob(job) {
        console.log(`Job Queue ${this.name} starting finishJob( job - ${job.id} )`);

        try {
            await db.jobs.setJobToFinished(job.id);
        } catch (err) {
            // TODO
            console.error(err.message);
            console.error(err);
        }

        this.timeOfLastFinishedJob = new Date().getTime();
        this.currentJob = null;
    }

    errorJob(job) {
        console.log(`Job Queue ${this.name} starting errorJob( job - ${job.id} )`);
        // something bad happened with the job
        // set to ERROR with messages in block
    }

    getNewJob() {
        console.log(`Job Queue ${this.name} starting getNewJob()`);
        return db.jobs.getRunnableJobOfType(this.jobTypeArray);
    }

    isJobRunning() {
        return this.currentJob !== null;
    }

    isReadyForNextJob() {
        let noPreviousJobs = this.timeOfLastFinishedJob === null;

        let currentTime = new Date().getTime();
        let minimumIntervalPassed = currentTime - this.timeOfLastFinishedJob >= this.rateLimitMs;

        return (noPreviousJobs || minimumIntervalPassed);
    }

    // run this in a setInterval
    async run() {
        console.log(`Job Queue ${this.name} starting run()`);

        if (this.isJobRunning() || !this.isReadyForNextJob()) {
            // nothing to do if we have a job, or we haven't waited enough for rate limit.
            return;
        }

        try {
            let job = await this.getNewJob();
            if (job === undefined) {
                return
            }

            job = await this.runJob(job);

            if (job.errors === null) {
                await this.finishJob(job);
            } else {
                await this.errorJob(job);
            }

        } catch (err) {
            // TODO
            console.error(err.message);
            console.error(err);
        }

    }
}

module.exports = JobQueue;
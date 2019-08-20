const jobs = require('./jobs');
const db = require('../../database');
const logger = require('../../utils/logger');

// Setup two queues, with different 'rate limits' to wait between each job
// Each queue will look at the database for jobs that use its API, maybe pass in a list of job types to search?

/**
 * JobQueue
 * Used to run all our jobs that query APIs at a rate that will prevent rate limits from getting hit
 *
 * Usage: invoke the run() function in a setTimeout loop.
 */
class JobQueue {

    /**
     * @param jobTypeArray {string[]} Array of jobType shortnames that this queue will run
     * @param rateLimitMs {number} Milliseconds to wait between each job
     * @param name {string} Name of queue to be used in logging
     */
    constructor(jobTypeArray, rateLimitMs, name) {
        this.timeOfLastFinishedJob = null;
        this.timeOfLastNoJobsFound = null;
        this.currentJob = null;

        this.jobTypeArray = jobTypeArray;
        this.rateLimitMs = rateLimitMs;
        this.name = name;
    }

    async runJob(jobRows) {
        let job = jobs.instantiateJob(jobRows);
        logger.verbose(`Job Queue ${this.name} starting runJob(${job.logPrefix()})`);

        this.currentJob = job;

        try {
            await db.jobs.setJobToRunning(job.id);
        } catch (err) {
            // TODO
            logger.error(err.message);
            console.error(err);
        }

        try {
            job = await job.run();
        } catch (err) {
            // TODO
            logger.error(err.message);
            console.error(err);
            // Job should handle its own API/DB related errors, if it gets here something bad happened.
        }

        return job;
    }

    async finishJob(job) {
        logger.verbose(`Job Queue ${this.name} starting finishJob( id: ${job.id} )`);

        try {
            await db.jobs.setJobToFinished(job.id);
        } catch (err) {
            // TODO
            logger.error(err.message);
            console.error(err);
        }

        this.timeOfLastFinishedJob = new Date().getTime();
        this.currentJob = null;
    }

    async errorJob(job) {
        logger.verbose(`Job Queue ${this.name} starting errorJob( id: ${job.id} )`);

        try {
            await db.jobs.setJobToError(job.id, job.errors)
        } catch (err) {
            // TODO
            logger.error(err.message);
            console.error(err);
        }

        this.timeOfLastFinishedJob = new Date().getTime();
        this.currentJob = null;
        // something bad happened with the job
        // set to ERROR with messages in block
    }

    getNewJob() {
        logger.verbose(`Job Queue ${this.name} starting getNewJob()`);
        return db.jobs.getRunnableJobOfType(this.jobTypeArray);
    }

    isJobRunning() {
        return this.currentJob !== null;
    }

    // Wait an arbitrary amount of time if we don't find any results.
    hasBeenEnoughTimeSinceLastNoJobsFound() {
        const waitTimeBetweenNoJobsFound = 10000; //10 seconds
        let firstTimeNotFindingJobs = this.timeOfLastNoJobsFound === null;

        let currentTime = new Date().getTime();
        let minimumIntervalPassed = currentTime - this.timeOfLastNoJobsFound >= waitTimeBetweenNoJobsFound;

        return (firstTimeNotFindingJobs || minimumIntervalPassed);
    }

    isReadyForNextJob() {
        let noPreviousJobs = this.timeOfLastFinishedJob === null;

        let currentTime = new Date().getTime();
        let minimumIntervalPassed = currentTime - this.timeOfLastFinishedJob >= this.rateLimitMs;

        return (noPreviousJobs || minimumIntervalPassed);
    }

    async run() {
        if (this.isJobRunning() || !this.isReadyForNextJob() || !this.hasBeenEnoughTimeSinceLastNoJobsFound()) {
            // nothing to do if we have a job, or we haven't waited enough for rate limit.
            return;
        }
        logger.verbose(`Job Queue ${this.name} starting run()`);

        try {
            let job = await this.getNewJob();
            if (job === undefined) {
                this.timeOfLastNoJobsFound = new Date().getTime();
                return;
            }

            job = await this.runJob(job);

            if (job.errors === null) {
                await this.finishJob(job);
            } else {
                await this.errorJob(job);
            }

        } catch (err) {
            // TODO
            logger.error(err.message);
            console.error(err);
        }

    }
}

module.exports = JobQueue;
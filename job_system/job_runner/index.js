

// Setup two queues, with different 'rate limits' to wait between each job
// Each queue will look at the DB for jobs that use its API, maybe pass in a list of job types to search?

class JobQueue {

    jobTypeArray = [];          // Job types queue will consume / look for
    rateLimitMs = 1000;         // Wait time in-between each job to prevent rate limit hits
    name = '';                  // Name of queue, used for logging

    timeOfLastFinishedJob = 0;
    currentJob = null;

    constructor(jobTypeArray, rateLimitMs, name) {
        this.jobTypeArray = jobTypeArray;
        this.rateLimitMs = rateLimitMs;
        this.name = name;
    }

    startJob(job){
        // Possibly do an extra check in DB to ensure that this has not started.
        // Set as current job
        // Change status to running
        // Let job do its thing
    }

    finishJob(job) {
        // job finished successfully
        // set job status to done.
        // set timeOfLastFinishedJob
        // clear currentJob
    }


    getNewJob() {
        // Check DB for any new/retry jobs that match types in our jobTypeArray.
        // LIMIT 1
        // Order by id / date created, get oldest.
        // if we find any, startJob it.
    }

    run() {
        // loop with setTimeOut or interval or something.
        // every X seconds, check if we have a currentJob.
        // if not, check if its been at least rateLimitMs MS since timeOfLastFinishedJob
        // if its been enough time, getNewJob
        // if we get a job, run it.
    }

}
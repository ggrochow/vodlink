const logger = require('../../../utils/logger');

/**
 * Job for shared functions, to be subclassed from, don't use directly
 * run() must be overwritten by the subclasses implementation
 */
class Job {

    constructor(jobRows) {
        this.jobRows = jobRows;
    }

    get shortName() {
        return this.jobRows.job_type;
    }

    get errors() {
        return this.jobRows.errors;
    }

    set errors(errorMessage) {
        this.jobRows.errors = errorMessage;
    }

    get payload() {
        return this.jobRows.payload;
    }

    get id() {
        return this.jobRows.id;
    }

    logPrefix() {
        return `Job id: ${this.id} - ${this.shortName}`;
    }

    logErrors() {
        logger.error(`${this.logPrefix()} - ${this.errors}`);
    }

    run() {
        throw new Error(`Attempted to run Job::run(), overwrite method in subclass - ${this.shortName}`);
    }

}

module.exports = Job;
const db = require('../../../database');
const logger = require('../../../utils/logger');

/**
 * Deletes all finished jobs
 *
 * Interval: once a week
 */
async function deleteFinishedJobs() {
    logger.verbose('Starting deleteFinishedJobs run');

    try {
        db.jobs.deleteFinishedJobs();
    } catch (sqlError) {
        logger.error(`deleteFinishedJobs SQL error deleting jobs - ${sqlError.message}`);
        console.error(sqlError);
        return;
    }

    logger.verbose('Finished deleting all jobs with status FINISHED');
}

module.exports = deleteFinishedJobs;
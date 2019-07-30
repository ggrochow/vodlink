/*
    Various utilities for job creation / modification
 */

const db = require('./raw_queries');
const jobStatusTypes = require('../job_system/job_status_types.js');


function createNewJob(jobType, payload) {
    let query = "INSERT INTO jobs(job_type, status, payload) VALUES ($1, $2, $3) RETURNING *";
    let params = [jobType, jobStatusTypes.NEW, payload];

    return db.queryOne(query, params);
}

function getRunnableJobOfType(jobTypeArray) {
    let query = "SELECT * FROM jobs WHERE job_type IN ( $1:list ) AND status IN ( $2:list ) ORDER BY id ASC LIMIT 1";
    let statusTypes = [jobStatusTypes.NEW, jobStatusTypes.RETRY];
    let params = [jobTypeArray, statusTypes];

    return db.queryOne(query, params);
}

function setJobToRunning(id) {
    return setJobToStatus(id, jobStatusTypes.RUNNING);
}

function setJobToFinished(id) {
    return setJobToStatus(id, jobStatusTypes.FINISHED);
}

function setJobToStatus(id, status) {
    let query = "UPDATE jobs SET status = $1 WHERE id = $2 RETURNING *";
    let params = [status, id];

    return db.queryOne(query, params);
}

module.exports = {
    createNewJob,
    getRunnableJobOfType,
    setJobToRunning,
    setJobToFinished,
};


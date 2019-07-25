/*
    Various utilities for job creation / modification
 */

const db = require('../DB');
const JOB_STATUS_TYPES = require('./job_status_types.js');


function createNewJob(job_type, payload) {
    let query = "INSERT INTO jobs(job_type, status, payload) VALUES ($1, $2, $3) RETURNING *";
    let params = [job_type, JOB_STATUS_TYPES.NEW, payload];
    
    return db.query(query, params);
}

module.exports = {
    createNewJob,
};


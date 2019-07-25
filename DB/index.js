/*
    Various DB utility functions
 */

const pg = require('pg');

const pool = new pg.Pool();

// Returns a Promise object
function query(text, params) {
    return pool.query(text, params);
}

module.exports = {
    query
};
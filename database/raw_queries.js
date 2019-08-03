/*
    Various database utility functions
 */
const logger = require('../utils/logger');
const pgp = require("pg-promise")();
const moment = require('moment');

// Avoid getting timezones into our PG DateTime return values, instead return a moment object with UTC;
// https://github.com/brianc/node-postgres/issues/429#issuecomment-24870258
// https://github.com/vitaly-t/pg-promise/issues/130
pgp.pg.types.setTypeParser(1114, function(strValue) {
    return moment.utc(strValue);
});

const db = pgp({
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD
});

// Returns a Promise object
function query(text, params) {
    logger.debug(`SQL: ${pgp.as.format(text, params)}`);
    return db.query(text, params);
}

function queryOne(text, params) {
    return new Promise( (resolve, reject) => {
        query(text, params)
            .then( res => resolve(res[0]) )
            .catch( err => reject(err) );
    });
}

module.exports = {
    query,
    queryOne,
};
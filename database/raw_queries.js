/*
    Various database utility functions
 */

const pgp = require("pg-promise")();
const db = pgp({
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD
});

// Returns a Promise object
function query(text, params) {
    console.log(pgp.as.format(text, params));
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
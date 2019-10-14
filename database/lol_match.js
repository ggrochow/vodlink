const db = require('./raw_queries');


function getByRegionAndNativeId(region, nativeMatchId) {
    let query = 'SELECT * FROM lol_matches WHERE region = $1 AND native_match_id = $2';
    let params = [region, nativeMatchId];

    return db.queryOne(query, params);
}

function getById(id) {
    let query = 'SELECT * FROM lol_matches WHERE id = $1;';
    let params = [id];

    return db.queryOne(query, params);
}

function createNew(nativeMatchId, winningTeam, startedAt, endedAt, region) {
    let query = '' +
        'INSERT INTO lol_matches ' +
        '(native_match_id, winning_team, started_at, ended_at, region) ' +
        'VALUES ($1, $2, $3, $4, $5) RETURNING *';
    let params =  [nativeMatchId, winningTeam, startedAt, endedAt, region];

    return db.queryOne(query, params);
}

function getLolMatchIdsOlderThanTwoMonths() {
    let query = `select id from lol_matches where started_at < (NOW() - interval '2 month')`;

    return db.query(query);
}

function deleteByIds(ids) {
    let query = `DELETE FROM lol_matches WHERE id IN ( $1:list )`;
    let params = [ids];

    return db.query(query, params);
}

module.exports = {
    getById,
    getByRegionAndNativeId,
    createNew,
    getLolMatchIdsOlderThanTwoMonths,
    deleteByIds,
};

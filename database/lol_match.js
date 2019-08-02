const db = require('./raw_queries');


function getByRegionAndNativeId(region, nativeMatchId) {
    let query = 'SELECT * FROM lol_matches WHERE region = $1 AND native_match_id = $2';
    let params = [region, nativeMatchId];

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

module.exports = {
    getByRegionAndNativeId,
    createNew,
};

const db = require('./raw_queries');

function createNew(matchId, teamId, championId, role, summonerName, nativeSummonerId, historyId) {
    let query = "" +
        "INSERT INTO lol_match_participants " +
        "(lol_match_id, team_id, champion_id, role, summoner_name, native_summoner_id, history_account_id) " +
        "VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *";
    let params = [matchId, teamId, championId, role, summonerName, nativeSummonerId, historyId];

    return db.queryOne(query, params);
}

function findByMatchId(matchId) {
    let query = 'SELECT * FROM lol_match_participants WHERE lol_match_id = $1';
    let params = [matchId];

    return db.query(query, params);
}

module.exports = {
    createNew,
    findByMatchId,
};
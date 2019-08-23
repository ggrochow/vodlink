const db = require('./raw_queries');

function createNew(matchId, teamId, championId, summonerName, nativeSummonerId) {
    let query = "" +
        "INSERT INTO lol_match_participants " +
        "(lol_match_id, team_id, champion_id, summoner_name, native_summoner_id) " +
        "VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";
    let params = [matchId, teamId, championId, summonerName, nativeSummonerId];

    return db.queryOne(query, params);
}

function getByMatchId(matchId) {
    let query = 'SELECT * FROM lol_match_participants WHERE lol_match_id = $1';
    let params = [matchId];

    return db.query(query, params);
}

function setRoleById(id, role) {
    let query = 'UPDATE lol_match_participants SET role = $1 WHERE id = $2';
    let params = [role, id];

    return db.queryOne(query, params);
}

module.exports = {
    createNew,
    getByMatchId,
    setRoleById,
};
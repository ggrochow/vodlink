const db = require('./raw_queries');

function createNew(matchId, teamId, championId, lane, role, summonerName, nativeSummonerId) {
    let query = "" +
        "INSERT INTO lol_match_participants " +
        "(lol_match_id, team_id, champion_id, lane, role, summoner_name, native_summoner_id) " +
        "VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *";
    let params = [matchId, teamId, championId, lane, role, summonerName, nativeSummonerId];

    return db.queryOne(query, params);
}

module.exports = {
    createNew,
};
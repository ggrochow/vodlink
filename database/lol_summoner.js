const db = require('./raw_queries');

function createNewLolSummoner(nativeSummonerId, summonerName, region, twitchChannelId) {
    let query = 'INSERT INTO lol_summoners(native_summoner_id, summoner_name, region, twitch_channel_id) VALUES ($1, $2, $3, $4) RETURNING *';
    let params = [nativeSummonerId, summonerName, region, twitchChannelId];

    return db.queryOne(query, params);
}

function getAllByTwitchId(twitchId) {
    let query = 'SELECT * FROM lol_summoners WHERE twitch_channel_id = $1';
    let params = [twitchId];

    return db.query(query, params);
}

function getById(id) {
    let query = 'SELECT * FROM lol_summoners WHERE id = $1';
    let params = [id];

    return db.queryOne(query, params);
}

module.exports = {
    createNewLolSummoner,
    getAllByTwitchId,
    getById,
};
const db = require('./raw_queries');

function createNewLolSummoner(nativeSummonerId, summonerName, region, twitchChannelId) {
    let query = 'INSERT INTO lol_summoners(native_summoner_id, summoner_name, region, twitch_channel_id) VALUES ($1, $2, $3, $4) RETURNING *';
    let params = [nativeSummonerId, summonerName, region, twitchChannelId];

    return db.queryOne(query, params);
}

module.exports = {
    createNewLolSummoner,
};
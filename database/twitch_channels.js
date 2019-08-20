const db = require('./raw_queries');

function createNew(twitchUserName, nativeTwitchId) {
    let query = '' +
        'INSERT INTO twitch_channels(native_channel_id, channel_name) VALUES($1, $2) ' +
        'ON CONFLICT ON CONSTRAINT twitch_channels_channel_name_key ' + // If we already have a channel with this name
        'DO UPDATE SET native_channel_id = EXCLUDED.native_channel_id ' + // Update the existing channel to the attempted ID
        'RETURNING *';
    let params = [nativeTwitchId, twitchUserName];

    return db.queryOne(query, params);
}

function getById(id) {
    let query = 'SELECT * FROM twitch_channels WHERE id = $1';
    let params = [id];

    return db.queryOne(query, params);
}

function getByNativeSummonerIds(nativeSummonerIds) {
    let query = '' +
        'SELECT * FROM twitch_channels WHERE id in ' +
        '   (' +
        '       SELECT twitch_channel_id FROM lol_summoners WHERE native_summoner_id IN ($1:list) ' +
        '   )';
    let params = [nativeSummonerIds];

    return db.query(query, params);
}

function getAll() {
    let query = 'SELECT * FROM twitch_channels';

    return db.query(query);
}

module.exports = {
    createNew,
    getById,
    getByNativeSummonerIds,
    getAll,
};
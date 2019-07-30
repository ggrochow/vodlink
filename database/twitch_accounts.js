const db = require('./raw_queries');

function createNewTwitchAccount(twitchUserName, nativeTwitchId) {
    let query = 'INSERT INTO twitch_channels(native_channel_id, channel_name) VALUES($1, $2) RETURNING *';
    let payload = [nativeTwitchId, twitchUserName];

    return db.queryOne(query, payload);
}

module.exports = {
    createNewTwitchAccount,
};
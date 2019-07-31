const db = require('./raw_queries');

function createNewTwitchAccount(twitchUserName, nativeTwitchId) {
    let query = '' +
        'INSERT INTO twitch_channels(native_channel_id, channel_name) VALUES($1, $2) ' +
        'ON CONFLICT ON CONSTRAINT twitch_channels_channel_name_key ' + // If we already have a channel with this name
        'DO UPDATE SET native_channel_id = EXCLUDED.native_channel_id ' + // Update the existing channel to the attempted ID
        'RETURNING *';
    let payload = [nativeTwitchId, twitchUserName];

    return db.queryOne(query, payload);
}

module.exports = {
    createNewTwitchAccount,
};
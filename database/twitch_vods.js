const db = require('./raw_queries');

function createNew(startedAt, endedAt, twitchChannelId, nativeVodId) {
    let query = '' +
        'INSERT INTO twitch_vods ' +
        '(started_at, ended_at, twitch_channel_id, native_vod_id) ' +
        'VALUES ($1, $2, $3, $4) RETURNING *';

    let params = [startedAt, endedAt, twitchChannelId, nativeVodId];

    return db.queryOne(query, params)
}

function getAllNativeVodIdsByTwitchChannelId(twitchChannelId) {
    let query = 'SELECT native_vod_id FROM twitch_vods WHERE twitch_channel_id = $1';
    let params = [twitchChannelId];

    return db.query(query, params);
}

module.exports = {
    createNew,
    getAllNativeVodIdsByTwitchChannelId,
};
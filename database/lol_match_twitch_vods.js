const db = require('./raw_queries');

function createNew(matchId, vodId, timestampString) {
    let query = '' +
        'INSERT INTO lol_match_twitch_vods ' +
        '(lol_match_id, twitch_vod_id, vod_timestamp) ' +
        'VALUES ($1, $2, $3) returning *';
    let params = [matchId, vodId, timestampString];

    return db.queryOne(query, params);
}

function findByMatchAndVodId(matchId, vodId) {
    let query = 'SELECT * FROM lol_match_twitch_vods WHERE lol_match_id = $1 AND twitch_vod_id = $2';
    let params = [matchId, vodId];

    return db.queryOne(query, params);
}

function deleteByVodId(vodId) {
    let query = 'DELETE FROM lol_match_twitch_vods WHERE twitch_vod_id  = $1';
    let params = [vodId];

    return db.query(query, params);
}

function deleteByLolMatchIds(ids) {
    let query = 'DELETE FROM lol_match_twitch_vods WHERE lol_match_id IN ( $1:list )';
    let params = [ids];

    return db.query(query, params);
}

module.exports = {
    createNew,
    findByMatchAndVodId,
    deleteByVodId,
    deleteByLolMatchIds,
};
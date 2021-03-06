const JOB_TYPES = {
    FETCH_TWITCH_CHANNEL_ID: 'FETCH_TWITCH_CHANNEL_ID',
    FETCH_LOL_SUMMONER_ID: 'FETCH_LOL_SUMMONER_ID',
    FETCH_NEW_TWITCH_VODS: 'FETCH_NEW_TWITCH_VODS',
    FETCH_LOL_MATCHES_DURING_VOD: 'FETCH_LOL_MATCHES_DURING_VOD',
    FETCH_LOL_MATCH_INFO: 'FETCH_LOL_MATCH_INFO',
    DETERMINE_LOL_MATCH_ROLES: 'DETERMINE_LOL_MATCH_ROLES',
    ASSOCIATE_LOL_MATCH_TO_TWITCH_VOD: 'ASSOCIATE_LOL_MATCH_TO_TWITCH_VOD',
    CLEANUP_EXPIRED_TWITCH_VODS: 'CLEANUP_EXPIRED_TWITCH_VODS',
    CHECK_VOD_EXISTENCE: 'CHECK_VOD_EXISTENCE',
};

module.exports = JOB_TYPES;

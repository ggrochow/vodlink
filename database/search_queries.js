const db = require('./raw_queries');

/**
 * Get a list of all championIds we have vod links to matches played by that champion for a specific role
 * @param role lol role string
 */
function getChampionIdsByRole(role) {
    let query ='' +
        'SELECT ' +
        '   DISTINCT participant.champion_id ' +
        'FROM ' +
        '   lol_match_twitch_vods AS relation ' +
        'JOIN lol_matches AS match on ' +
        '   match.id = relation.lol_match_id ' +
        'JOIN lol_match_participants AS participant ON ' +
        '   participant.lol_match_id = relation.lol_match_id ' +
        'JOIN lol_summoners AS summoner ON ' +
        '   participant.native_summoner_id = summoner.native_summoner_id ' +
        'JOIN lol_match_participants AS opponent ON ' +
        '   match.id = opponent.lol_match_id ' +
        '   AND participant.role = opponent.role' +
        '   AND participant.team_id != opponent.team_id ' +
        'WHERE ' +
        '   participant.role = $1';

    let params = [role];

    return db.query(query, params);
}

/**
 * Get a list of all championIds we have vod links to matches played against for a specific role & streamer champ
 * @param role lol role string
 * @param championId lol championId
 */
function getOpponentChampionIdsByRoleAndOurChampion(role, championId) {
    let query = '' +
        'SELECT ' +
        '   DISTINCT opponent.champion_id ' +
        'FROM ' +
        '   lol_match_twitch_vods AS relation ' +
        'JOIN twitch_vods as vod ON ' +
        '   vod.id = relation.twitch_vod_id ' +
        'JOIN lol_matches AS match ON ' +
        '   match.id = relation.lol_match_id ' +
        'JOIN lol_match_participants AS participant ON ' +
        '   match.id = participant.lol_match_id ' +
        'JOIN lol_summoners AS summoner ON ' +
        '   participant.native_summoner_id = summoner.native_summoner_id ' +
        'JOIN lol_match_participants AS opponent ON ' +
        '   match.id = opponent.lol_match_id ' +
        '   AND participant.role = opponent.role' +
        '   AND participant.team_id != opponent.team_id ' +
        'WHERE ' +
        '   participant.role = $1 ' +
        '   AND participant.champion_id = $2';

    let params = [role, championId];

    return db.query(query, params);
}

function getVodLinkInfoByMatchUp(role, championId, opponentChampionId) {
    let query = '' +
        'SELECT ' +
        '   relation.id AS id, ' +
        '   vod.native_vod_id AS vod_id, ' +
        '   relation.vod_timestamp AS vod_offset_seconds, ' +
        '   match.native_match_id AS native_match_id, ' +
        '   channel.channel_name AS streamer_name, '+
        '   summoner.summoner_name AS summoner_name, ' +
        '   summoner.region AS region, ' +
        '   opponent.summoner_name AS opp_name ' +
        'FROM ' +
        '   lol_match_twitch_vods AS relation ' +
        'JOIN twitch_vods AS vod ON ' +
        '   vod.id = relation.twitch_vod_id ' +
        'JOIN twitch_channels as channel ON ' +
        '   channel.id = vod.twitch_channel_id ' +
        'JOIN lol_matches AS match ON ' +
        '   match.id = relation.lol_match_id ' +
        'JOIN lol_match_participants AS participant ON ' +
        '   match.id = participant.lol_match_id ' +
        'JOIN lol_summoners AS summoner ON ' +
        '   participant.native_summoner_id = summoner.native_summoner_id ' +
        'JOIN lol_match_participants AS opponent ON ' +
        '   match.id = opponent.lol_match_id ' +
        '   AND participant.team_id != opponent.team_id ' +
        '   AND participant.role = opponent.role ' +
        'WHERE ' +
        '   participant.role = $1 ' +
        '   AND participant.champion_id = $2 ' +
        '   AND opponent.champion_id = $3';

    let params = [role, championId, opponentChampionId];


    // TODO pagination
    return db.query(query, params);
}

module.exports = {
    getChampionIdsByRole,
    getOpponentChampionIdsByRoleAndOurChampion,
    getVodLinkInfoByMatchUp,
};
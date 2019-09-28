const db = require('./raw_queries');

function getJoinAsName(playerInfo) {
    return `${playerInfo.team}_${playerInfo.role}`;
}

/**
 * Query builder function for a full matchup search
 * @param matchupInfo Array of Objects with information on the matchup to query for.
 *                    Each object will must have the following fields
 *                    role - Role of champion played
 *                    champion - id of champion played
 *                    team - ally | enemy, indicating which teamId to check against
 *                    streamer - true | false, indicating which player we want to check for vods for
 * @param page pagination page, 25 results per page max
 *
 */
function matchupSearch(matchupInfo, page = 0) {
    let baseQuery = `
    select * from 
        lol_match_twitch_vods as relation
    join lol_matches as match on
        match.id = relation.lol_match_id
    join lol_match_participants as participant on
        match.id = participant.lol_match_id
    join lol_summoners as summoner on
        participant.native_summoner_id = summoner.native_summoner_id
    join twitch_channels as channel on
        channel.id = summoner.twitch_channel_id
    join twitch_vods as vod on
        vod.id = relation.twitch_vod_id
        and vod.twitch_channel_id = channel.id
    `;

    let joins = [];
    let where = [];
    let params = {};

    matchupInfo.forEach(playerInfo => {
        if (playerInfo.streamer === false) {
            let joinName = getJoinAsName(playerInfo);

            params[joinName] = {
                joinName,
                championId: playerInfo.champion,
                role: playerInfo.role
            };

            let teamJoinType = playerInfo.team === 'enemy' ? '!=' : '=';

            joins.push(
                `join lol_match_participants as $[${joinName}.joinName~] on
                    $[${joinName}.joinName~].lol_match_id = match.id
                    and $[${joinName}.joinName~].team_id ${teamJoinType} participant.team_id`
            );

            where.push(
                `$[${joinName}.joinName~].role = $[${joinName}.role]`,
                `$[${joinName}.joinName~].champion_id = $[${joinName}.championId]`
            );

        } else {
            params.participant = {
                role: playerInfo.role,
                championId: playerInfo.champion
            };
            where.push(
                `participant.role = $[participant.role]`,
                `participant.champion_id = $[participant.championId]`
            );
        }


    });

    let query = `${baseQuery} ${joins.join('\n')} 
    WHERE ${where.join('\n AND ')}`;

    return db.query(query, params);
}

module.exports = {
    matchupSearch
};

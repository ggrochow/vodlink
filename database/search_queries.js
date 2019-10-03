const db = require('./raw_queries');
const fullMatchupSearch = require('./full_matchup_search');

/**
 * Get a list of all championIds we have vod links to matches played by that champion for a specific role
 * @param role lol role string
 */
function getChampionIdsByRole(role) {
    let query = `
select
	distinct participant.champion_id
from
	lol_match_twitch_vods as relation
join lol_matches as match on
	match.id = relation.lol_match_id
join lol_match_participants as participant on
	participant.lol_match_id = relation.lol_match_id
join lol_summoners as summoner on
	participant.native_summoner_id = summoner.native_summoner_id
join lol_match_participants as opponent on
	match.id = opponent.lol_match_id
	and participant.role = opponent.role
	and participant.team_id != opponent.team_id
where
	participant.role = $1
    `;

    let params = [role];

    return db.query(query, params);
}

/**
 * Get a list of all championIds we have vod links to matches played against for a specific role & streamer champ
 * @param role lol role string
 * @param championId lol championId
 */
function getOpponentChampionIdsByRoleAndOurChampion(role, championId) {
    let query = `
select
	distinct opponent.champion_id
from
	lol_match_twitch_vods as relation
join twitch_vods as vod on
	vod.id = relation.twitch_vod_id
join lol_matches as match on
	match.id = relation.lol_match_id
join lol_match_participants as participant on
	match.id = participant.lol_match_id
join lol_summoners as summoner on
	participant.native_summoner_id = summoner.native_summoner_id
join lol_match_participants as opponent on
	match.id = opponent.lol_match_id
	and participant.role = opponent.role
	and participant.team_id != opponent.team_id
where
	participant.role = $1
	and participant.champion_id = $2 
	`;
    let params = [role, championId];

    return db.query(query, params);
}

function getVodLinkInfoByMatchUp(role, championId, opponentChampionId) {
    let query = `
select
	relation.id as id,
	vod.native_vod_id as vod_id,
	relation.vod_timestamp as vod_offset_seconds,
	match.native_match_id as native_match_id,
	channel.channel_name as streamer_name,
	summoner.summoner_name as summoner_name,
	summoner.region as region,
	opponent.summoner_name as opp_name
from
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
join lol_match_participants as opponent on
	match.id = opponent.lol_match_id
	and participant.team_id != opponent.team_id
	and participant.role = opponent.role
where
	participant.role = $1
	and participant.champion_id = $2
	and opponent.champion_id = $3
    `;
    let params = [role, championId, opponentChampionId];


    // TODO pagination
    return db.query(query, params);
}

module.exports = {
    getChampionIdsByRole,
    getOpponentChampionIdsByRoleAndOurChampion,
    getVodLinkInfoByMatchUp,
    fullMatchupSearch: fullMatchupSearch.matchupSearch
};
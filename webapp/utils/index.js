import lolData from '../../utils/lol_data';

export function lolRoleImageUrl(role) {
    if (role) {
        return `/static/${role.toLowerCase()}.png`;
    }
}

export function championImageUrlById(id) {
    if (id === undefined || id === null) {
        return `/static/no_champion.png`;
    }

    return lolData.championById[id].imageUrl;
}

export function championNameById(id) {
    return lolData.championById[id].name;
}

export function twitchVodLink(vodId, secondsOffset) {
    let loadingOffset = 90; // Timestamps are at game load start, we skip ahead a little to prevent linking to load screens.

    return `https://www.twitch.tv/videos/${vodId}?t=${secondsOffset + loadingOffset}s`;
}

export function matchHistoryLink(region, matchId) {

    return `https://matchhistory.na.leagueoflegends.com/en/#match-details/${region.toUpperCase()}/${matchId}?tab=overview`;
}

export function capitalize(str) {
    return str[0].toUpperCase() + str.slice(1);
}

export const lolRoles = [
    'top',
    'jungle',
    'mid',
    'support',
    'bot',
];

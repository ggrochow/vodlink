export function lolRoleImageUrl(role) {
    if (role) {
        return `/static/${role}.png`;
    }
}

export function twitchVodLink(vodId, secondsOffset) {
    let loadingOffset = 90; // Timestamps are at game load start, we skip ahead a little to prevent linking to load screens.

    return `https://www.twitch.tv/videos/${vodId}?t=${secondsOffset + loadingOffset}s`;
}

export function matchHistoryLink(region, matchId) {

    return `https://matchhistory.na.leagueoflegends.com/en/#match-details/${region.toUpperCase()}/${matchId}?tab=overview`;
}
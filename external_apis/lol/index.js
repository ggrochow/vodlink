const requestPromise = require('request-promise-native');
const API_KEY = process.env['LOL_API_KEY'];

function baseUrl(regionCode) {
    return `https://${regionCode}.api.riotgames.com`
}

function request(url, queryParams = {}) {
    let options = {
        uri: url,
        qs: queryParams,
        headers: {
            'X-Riot-Token': API_KEY,
        },
        json: true
    };

    return requestPromise(options);
}

function getAccountInfoFromSummonerName(region, summonerName) {
    let url = `${baseUrl(region)}/lol/summoner/v4/summoners/by-name/${summonerName}`;

    return request(url);
}

function getMatchesForAccountInPeriod(region, accountId, beginTime, endTime) {
    let url = `${baseUrl(region)}/lol/match/v4/matchlists/by-account/${accountId}`;
    let params = {
        beginTime,
        endTime,
    };

    return request(url, params);
}

function getMatchInfoById(region, matchId) {
    let url = `${baseUrl(region)}/lol/match/v4/matches/${matchId}`;

    return request(url);
}

module.exports = {
    getAccountInfoFromSummonerName,
    getMatchesForAccountInPeriod,
    getMatchInfoById,
};
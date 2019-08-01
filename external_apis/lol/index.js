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

module.exports = {
    getAccountInfoFromSummonerName,
};
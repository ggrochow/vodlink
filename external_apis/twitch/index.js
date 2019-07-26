const requestPromise = require('request-promise-native');
const NEW_API_BASE_URL = 'https://api.twitch.tv/helix';
const CLIENT_ID = process.env['TWITCH_CLIENT_ID'];


function request(url, queryParams) {
    let options = {
        uri: url,
        qs: queryParams,
        headers: {
            'Client-ID': CLIENT_ID
        },
        json: true
    };

    return requestPromise(options);
}


// Get user info by twitch name
// GET https://api.twitch.tv/helix/users?login=XXXXXXX
function getUserInfoFromChannelName(channel_name) {
    let url = `${NEW_API_BASE_URL}/users`;
    let queryParams = { login: channel_name };

    return request(url, queryParams);
}

module.exports = {
    getUserInfoFromChannelName,
};
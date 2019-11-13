const fs = require('fs');
const requestPromise = require('request-promise-native');
const championJsonPath = 'utils/lol_data/champion.json'; // from project root
const versionsUrl = 'https://ddragon.leagueoflegends.com/realms/na.json';


function request(uri) {
    let options = {
        uri,
        json: true,
    };

    return requestPromise(options);
}


async function run() {
    debugger
    let versionsJson = await request(versionsUrl);
    let championVersion = versionsJson.n.champion;
    let championUrl = `http://ddragon.leagueoflegends.com/cdn/${championVersion}/data/en_US/champion.json`;
    let championJson = await request(championUrl);

    let championById = {};
    for (let key in championJson.data) {
        let championInfo = championJson.data[key];

        championById[championInfo.key] = {
            name: championInfo.name,
            id: championInfo.id,
            key: championInfo.key,
            imageUrl: `https://ddragon.leagueoflegends.com/cdn/${championVersion}/img/champion/${championInfo.id}.png`,
        };
    }

    fs.writeFileSync(championJsonPath, JSON.stringify(championById))
}


run();


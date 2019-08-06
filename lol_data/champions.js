let championJson = require('./champion.json');
// champion.json can be downloaded from the data section in
// https://developer.riotgames.com/ddragon.html

let championById = {};
let championByName = {};
const ddragonVersion = championJson.version;

for (let key in championJson.data) {
    let championInfo = championJson.data[key];

    championByName[championInfo.name] = championInfo.key;
    championById[championInfo.key] = championInfo.name;
}

function championSquareImgUrl(championId) {
    let championName = encodeURIComponent(championById[championId]);
    return `http://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/img/champion/${championName}}.png `
}

module.exports = {
    ddragonVersion,
    championSquareImgUrl,
    championById,
    championByName,
};


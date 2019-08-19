let championJson = require('./champion.json');
// champion.json can be downloaded from the data section in
// TODO: make a script to generate our own champion.json so we can include it in our frontend w/o it being 100kb
// https://developer.riotgames.com/ddragon.html

let championById = {};
const ddragonVersion = championJson.version;

for (let key in championJson.data) {
    let championInfo = championJson.data[key];

    championById[championInfo.key] = {
        name: championInfo.name,
        id: championInfo.id,
        key: championInfo.key,
        imageUrl: `http://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/img/champion/${championInfo.id}.png`,
    }
}

module.exports = {
    ddragonVersion,
    championById,
};


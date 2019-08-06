//  TODO: get info by champion id, including links to stuff
// save dd version

const champions = require('./champions.js');

const roles = [
    'DUO_CARRY',
    'DUO_SUPPORT',
    'NONE',
    'SOLO'
];

const lanes = [
    'BOTTOM',
    'MIDDLE',
    'JUNGLE',
    'TOP'
];

const roleLaneByReadableRole = {
    ADC:        { ROLE: 'DUO_ADC',      LANE: 'BOTTOM' },
    SUPPORT:    { ROLE: 'DUS_SUPPORT',  LANE: 'BOTTOM' },
    JUNGLE:     { ROLE: 'NONE',         LANE: 'JUNGLE' },
    MID:        { ROLE: 'SOLO',         LANE: 'MIDDLE' },
    TOP:        { ROLE: 'SOLO',         LANE: 'TOP'    },
};

module.exports = {
    roleLaneByReadableRole,
    roles,
    lanes,
    championById: champions.championById,
    championIdByName: champions.championByName
};

//  TODO: get info by champion id, including links to stuff
// save dd version

const champions = require('./champions.js');

const rolesByNativeRole = {
    DUO_CARRY: 'bot',
    DUO_SUPPORT: 'support',
    NONE: 'jungle',
};

const soloRoles =  {
    TOP: 'top',
    MIDDLE: 'mid',
};

function getRoleByNativeLolRoleLane(role, lane) {
    if (role === 'SOLO') {
        return soloRoles[lane];
    } else {
        return rolesByNativeRole[role];
    }
}

module.exports = {
    championById: champions.championById,
    getRoleByNativeLolRoleLane,
};

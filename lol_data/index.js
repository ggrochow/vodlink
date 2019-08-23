//  TODO: get info by champion id, including links to stuff
// save dd version

const championById = require('./champion.json');

const rolesByRoleMlRole = {
    jungle: 'jungle',
    top: 'top',
    mid: 'mid',
    bot: 'bot',
    supp: 'support',
};

module.exports = {
    championById,
    rolesByRoleMlRole
};

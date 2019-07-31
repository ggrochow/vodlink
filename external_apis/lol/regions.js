const regions = {
    'BR':       'br1',
    'EUNE':     'eun1',
    'EUW':      'euw1',
    'JP':       'jp1',
    'KR':       'kr',
    'LAN':      'la1',
    'LAS':      'la2',
    'NA':       'na1',
    // Note: The NA region has two associated platform values - NA and NA1.
    // Older summoners will have the NA platform associated with their account,
    // while newer summoners will have the NA1 platform associated with their account.
    // source: https://developer.riotgames.com/regional-endpoints.html
    'NA0':      'na',
    'OCE':      'oc1',
    'TR':       'tr1',
    'RU':       'ru',
    'PBE':      'pbe1',
};

module.exports = regions;
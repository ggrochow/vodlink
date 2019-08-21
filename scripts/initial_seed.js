/*
    Initial seed file for database.
    Adds twitch channels & respective LoL accounts to database for job queue to do its thing.
 */
require('dotenv').config();

const db = require('../database');
const JOB_TYPES = require('../job_system/job_queue/job_types.js');

const ACCOUNTS = [
    {
        twitch_name: 'c9sneaky',
        lol_accounts: [
            {
                region: 'na1',
                name: 'C9 Sneaky'
            },
        ]
    },
    {
        twitch_name: 'voyboy',
        lol_accounts: [
            {
                region: 'na1',
                name: 'VoyBoy'
            },

        ]
    },
    {
        twitch_name: 'faker',
        lol_accounts: [
            {
                region: 'kr',
                name: 'Hide on bush'
            }
        ]
    },
    {
        twitch_name: 'rush',
        lol_accounts: [
            {
                region: 'kr',
                name: 'Roosh'
            },
            {
                region: 'kr',
                name: 'pvman'
            }
        ]
    },
    {
        twitch_name: 'mandiocaa1',
        lol_accounts: [
            {
                region: 'br1',
                name: 'Mandioquinhaa'
            }
        ]
    },
    {
        twitch_name: 'noway4u_sir',
        lol_accounts: [
            {
                region: 'euw1',
                name: 'Potato4u',
            }
        ]
    },
    {
        twitch_name: 'nightblue3',
        lol_accounts: [
            {
                region: 'na1',
                name: 'Nightblue3',
            }
        ]
    },
    {
        twitch_name: 'Yassuo',
        lol_accounts: [
            {
                region: 'na1',
                name: 'Yassuo',
            }
        ]
    },
    {
        twitch_name: 'caps',
        lol_accounts: [
            {
                region: 'euw1',
                name: 'G2 Caps 01'
            },
            {
                region: 'euw1',
                name: 'TheShackledOne'
            }
        ]
    },
    {
        twitch_name: 'hashinshin',
        lol_accounts: [
            {
                region: 'na1',
                name: 'PermaBan Riven'
            }
        ]
    },
    {
        twitch_name: 'jovirone',
        lol_accounts: [
            {
                region: 'br1',
                name: 'KR Jovi'
            }
        ]
    },
    {
        twitch_name: 'imaqtpie',
        lol_accounts: [
            {
                region: 'na1',
                name: 'Imaqtpie'
            },
            {
                region: 'na1',
                name: 'imaqtpie fangirl'
            }
        ]
    },
    {
        twitch_name: 'pimpimenta',
        lol_accounts: [
            {
                region: 'br1',
                name: 'pimpimenta'
            }
        ]
    },
    {
        twitch_name: 'lol_ambition',
        lol_accounts: [
            {
                region: 'kr',
                name: 'maengsdog'
            }
        ]
    },
    {
        twitch_name: 'doublelift',
        lol_accounts: [
            {
                region: 'na1',
                name: 'doublelift'
            }
        ]
    },
    {
        twitch_name: 'corejj',
        lol_accounts: [
            {
                region: 'na1',
                name: 'From Iron'
            }
        ]
    },
    {
        twitch_name: 'metaphor',
        lol_accounts: [
            {
                region: 'na1',
                name: 'metaphor'
            }
        ]
    },
];

ACCOUNTS.forEach( accountObj => {
    let jobType = JOB_TYPES.FETCH_TWITCH_CHANNEL_ID;
    let payload = {
        twitchName: accountObj.twitch_name,
        lolAccounts: accountObj.lol_accounts,
    };

    db.jobs.createNewJob(jobType, payload)
        .catch(e => console.error(JSON.stringify(e, null, 4)));
});



/*
    Initial seed file for database.
    Adds twitch channels & respective LoL accounts to database for job queue to do its thing.
 */
require('dotenv').config();

const regions = require('../external_apis/lol/regions');
const db = require('../database');
const JOB_TYPES = require('../job_system/job_types.js');

const ACCOUNTS = [
    {
        twitch_name: 'c9sneaky',
        lol_accounts: [
            {
                region: regions.NA,
                name: 'C9 Sneaky'
            },
        ]
    },
    {
        twitch_name: 'voyboy',
        lol_accounts: [
            {
                region: regions.NA,
                name: 'VoyBoy'
            },

        ]
    },
    {
        twitch_name: 'faker',
        lol_accounts: [
            {
                region: regions.KR,
                name: 'Hide on bush'
            }
        ]
    }

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


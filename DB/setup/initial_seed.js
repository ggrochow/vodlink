/*
    Initial seed file for database.
    Adds twitch channels & respective LoL accounts to database for job queue to do its thing.
 */

const jobUtils = require('../../job_system/job_utils.js');
const JOB_TYPES = require('../../job_system/job_types.js');

const ACCOUNTS = [
    {
        twitch_name: 'c9sneaky',
        lol_accounts: [
            {
                region: 'NA',
                name: 'C9 Sneaky'
            },
        ]
    },
    {
        twitch_name: 'voyboy',
        lol_accounts: [
            {
                region: 'NA',
                name: 'VoyBoy'
            },

        ]
    },
    {
        twitch_name: 'faker',
        lol_accounts: [
            {
                region: 'KR',
                name: 'Hide on bush'
            }
        ]
    }

];

ACCOUNTS.forEach( accountObj => {
    let jobType = JOB_TYPES.FETCH_TWITCH_CHANNEL_ID;
    let payload = {
        twitch_name: accountObj.twitch_name,
        lol_accounts: accountObj.lol_accounts,
    };

    jobUtils.createNewJob(jobType, payload)
        .then(res => {
            console.log(`job ID ${res.rows.id} created with type ${jobType} and payload ${payload}`);
        })
        .catch(e => console.log(JSON.stringify(e, null, 4)));
});


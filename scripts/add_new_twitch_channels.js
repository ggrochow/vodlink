require('dotenv').config();

const db = require('../database');
const jobTypes = require('../job_system/job_queue/job_types');

const accountsToAdd = require('../channels.json');


accountsToAdd.channels.forEach(channelInfo => {
    let payload = {
        twitchName: channelInfo.twitch_name,
        lolAccounts: channelInfo.lol_accounts
    };

    db.jobs.createNewJob(jobTypes.FETCH_TWITCH_CHANNEL_ID, payload)
        .then(res => console.log(`Created fetch channel job for - ${channelInfo.twitch_name} with id ${res.id}`))
        .catch(err => console.error(err));
});



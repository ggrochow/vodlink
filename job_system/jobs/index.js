const jobTypes = require('../job_types');

const FetchTwitchChannelId = require('./fetch_twitch_channel_id');

const jobs = {
    [jobTypes.FETCH_TWITCH_CHANNEL_ID]: FetchTwitchChannelId,
};

function instantiateJob(jobRows) {
    let JobClass = jobs[jobRows.job_type];

    return new JobClass(jobRows);
}

module.exports = {
    jobs,
    instantiateJob,
};



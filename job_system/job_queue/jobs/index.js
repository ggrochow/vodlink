const jobTypes = require('../job_types');

const FetchTwitchChannelId = require('./fetch_twitch_channel_id');
const FetchLoLSummonerId = require('./fetch_lol_summoner_id');
const FetchNewTwitchVods = require('./fetch_new_twitch_vods');
const FetchLolMatchesDuringVod = require('./fetch_lol_matches_during_vod');
const FetchLolMatchInfo = require('./fetch_lol_match_info');
const DetermineLolMatchRoles = require('./determine_lol_match_roles');
const AssociateLolMatchToTwitchVods = require('./associate_lol_match_to_twitch_vods');
const CheckVodExistence = require('./check_vod_existence');

const jobs = {
    [jobTypes.FETCH_TWITCH_CHANNEL_ID]: FetchTwitchChannelId,
    [jobTypes.FETCH_LOL_SUMMONER_ID]: FetchLoLSummonerId,
    [jobTypes.FETCH_NEW_TWITCH_VODS]: FetchNewTwitchVods,
    [jobTypes.FETCH_LOL_MATCHES_DURING_VOD]: FetchLolMatchesDuringVod,
    [jobTypes.FETCH_LOL_MATCH_INFO]: FetchLolMatchInfo,
    [jobTypes.DETERMINE_LOL_MATCH_ROLES]: DetermineLolMatchRoles,
    [jobTypes.ASSOCIATE_LOL_MATCH_TO_TWITCH_VOD]: AssociateLolMatchToTwitchVods,
    [jobTypes.CHECK_VOD_EXISTENCE]: CheckVodExistence,
};

function instantiateJob(jobRows) {
    let JobClass = jobs[jobRows.job_type];

    return new JobClass(jobRows);
}

module.exports = {
    instantiateJob,
};



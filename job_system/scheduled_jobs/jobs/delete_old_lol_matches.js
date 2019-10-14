const db = require('../../../database');
const logger = require('../../../utils/logger');

/**
 * Deletes all LoL matches older than 2 months,
 * ensuring to delete any participants, and lol_match_twitch_vods related to them.
 */
async function deleteOldLolMatches() {
    logger.verbose('Starting DeleteOldLolMatchesRun');
    debugger;

    // Get ids of lol matches older than 2 months
    let oldLolMatchIds;
    try {
        oldLolMatchIds = await db.lolMatches.getLolMatchIdsOlderThanTwoMonths();
        oldLolMatchIds = oldLolMatchIds.map((row) => row.id);
    } catch (sqlError) {
        logger.error(`Error fetching old LoL match IDs ${sqlError.message}`);
        console.error(sqlError);
        return;
    }

    if (!oldLolMatchIds || oldLolMatchIds.length === 0) {
        return;
    }

    // delete lol_matches with those ids
    try {
        await db.lolMatches.deleteByIds(oldLolMatchIds);
    } catch (sqlError) {
        logger.error(`Error deleting old LoL matches by IDs ${sqlError.message}`);
        console.error(sqlError);
        return;
    }

    // Delete lol_match_participants with those ids
    try {
        await db.lolMatchParticipant.deleteByLolMatchIds(oldLolMatchIds);
    } catch (sqlError) {
        logger.error(`Error deleting old lol_match_participants by IDs ${sqlError.message}`);
        console.error(sqlError);
        return;
    }

    // Delete lol_match_twitch_vods with those ids
    try {
        await db.lolMatchTwitchVods.deleteByLolMatchIds(oldLolMatchIds);
    } catch (sqlError) {
        logger.error(`Error deleting old lol_match_twitch_vods by IDs ${sqlError.message}`);
        console.error(sqlError);
        return;
    }
}

module.exports = deleteOldLolMatches;
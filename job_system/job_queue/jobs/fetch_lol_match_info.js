const Job = require('./job');
const lolApi = require('../../../external_apis/lol');
const lolData = require('../../../lol_data');
const db = require('../../../database');
const jobTypes = require('../job_types');
const moment = require('moment');

/**
 * Job to get details about a LoL Match and its participants
 *
 * PAYLOAD : {
 *     nativeMatchId:
 *     region:
 * }
 * nativeMatchId: native lol API match id
 * region: region match took place.
 *
 * Starts an AssociateLolMatchToTwitchVod job after completion.
 */
class FetchLolMatchInfoJob extends Job {

    get nativeMatchId() {
        return this.payload.nativeMatchId;
    }

    get region() {
        return this.payload.region;
    }

    async run() {
        // This match can already exist if another streamer was in the game.
        let lolMatch;
        try {
            lolMatch = await db.lolMatches.getByRegionAndNativeId(this.region, this.nativeMatchId);
        } catch (sqlError) {
            this.errors = `SQLError attempting to retrieve existing match from DB - ${sqlError.message}`;
            this.logErrors();
            console.error(sqlError);
            return this;
        }

        // If we know about it, we don't need to collect any more info, but we might have new vods to compare against
        // so we create a new associate job to check.
        if (lolMatch !== undefined) {
            try {
                let payLoad = { matchId: lolMatch.id };
                await db.jobs.createNewJob(jobTypes.ASSOCIATE_LOL_MATCH_TO_TWITCH_VOD, payLoad);
            } catch (sqlError) {
                this.errors = `SQL error when creating ASSOCIATE job - ${sqlError.message}`;
                this.logErrors();
                console.error(sqlError);
                return this;
            }
        }


        let apiResult;
        try {
            apiResult = await lolApi.getMatchInfoById(this.region, this.nativeMatchId);
        } catch (apiError) {
            this.errors = `Error while retrieving match info from lol api - ${apiError.message}`;
            this.logErrors();
            console.error(apiError);
            return this;
        }

        // We only want to show ranked solo Q games.
        const soloQueueRankedId = 420;
        if (apiResult.queueId !== soloQueueRankedId) {
            return this;
        }

        let startTime = moment.utc(apiResult.gameCreation);
        let endTime = moment.utc(apiResult.gameCreation).add(apiResult.gameDuration, 'seconds');

        let winningTeam = apiResult.teams.find(teamInfo => teamInfo.win === 'Win');
        let winningTeamId = winningTeam.teamId;

        try {
            lolMatch = await db.lolMatches.createNew(this.nativeMatchId, winningTeamId, startTime, endTime, this.region);
        } catch (sqlError) {
            this.errors = `Error saving lolMatch to database - ${sqlError.message}`;
            this.logErrors();
            console.error(sqlError);
            return this;
        }


        // Gather all participant info, it lives in two separate arrays in the api results, so we have to do some combining
        let participants = {};

        for (let participantIndex in apiResult.participants) {
            let participant = apiResult.participants[participantIndex];
            let role = lolData.getRoleByNativeLolRoleLane(participant.timeline.role, participant.timeline.lane);
            if (role === undefined || role === null) {
                // TODO: handle no role found. This is fairly common
                role = `${participant.timeline.lane} - ${participant.timeline.role}`;
            }
            let participantInfo = {
                participantId: participant.participantId,
                teamId: participant.teamId,
                championId: participant.championId,
                role,
            };

            participants[participantInfo.participantId] = participantInfo;
        }

        for (let participantIdentityIndex in apiResult.participantIdentities) {
            let participantIdentity = apiResult.participantIdentities[participantIdentityIndex];
            let historyUri = participantIdentity.player.matchHistoryUri.split('/');
            // To be able to link to the match history page, we need to extract the final number from this URI
            // "/v1/stats/player_history/NA/78247"
            let historyId = historyUri[historyUri.length - 1];

            let identityInfo = {
                participantId:  participantIdentity.participantId,
                accountId: participantIdentity.player.accountId,
                summonerName: participantIdentity.player.summonerName,
                historyAccountId: historyId,
            };

            Object.assign(participants[identityInfo.participantId], identityInfo);
        }

        // Save all our participant info
        let matchId = lolMatch.id;
        for (let participantId in participants) {
            let participant = participants[participantId];
            try {
                await db.lolMatchParticipant.createNew(
                    matchId, participant.teamId, participant.championId,
                    participant.role, participant.summonerName, participant.accountId,
                    participant.historyAccountId
                );
            } catch (sqlError) {
                this.errors = `Error saving lol_match_participant to DB - ${sqlError.message}`;
                this.logErrors();
                console.error(sqlError);
                return this;
            }
        }

        // and finally create an associate job
        let payload = { matchId };
        try {
            await db.jobs.createNewJob(jobTypes.ASSOCIATE_LOL_MATCH_TO_TWITCH_VOD, payload);
        } catch (sqlError) {
            this.errors = `SQL error when creating ASSOCIATE job - ${sqlError.message}`;
            this.logErrors();
            console.error(sqlError);
            return this;
        }

        return this;
    }

}

module.exports = FetchLolMatchInfoJob;
const Job = require('./job');
const lolApi = require('../../../external_apis/lol');
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
                return this;
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
            if (apiError.statusCode === 429 || apiError.statusCode >= 500) {
                this.setToRetry();
                return this;
            }

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

        let minimumGameLength = 12 * 60;
        if (apiResult.gameDuration < minimumGameLength) {
            // The library used to determine roles requires at least 12 minutes of Game time
            // additionally games took less than 12m are likely of very low quality.
            return this;
        }

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

            let participantInfo = {
                participantId: participant.participantId,
                teamId: participant.teamId,
                championId: participant.championId,
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
                accountId: participantIdentity.player.currentAccountId,
                summonerName: participantIdentity.player.summonerName,
                historyAccountId: historyId,
            };

            Object.assign(participants[identityInfo.participantId], identityInfo);
        }


        let participantMapping = {
            // participantId: lol_match_participant.id
        };

        // Save all our participant info
        let matchId = lolMatch.id;
        for (let participantId in participants) {
            let participantInfo = participants[participantId];
            try {
                 let participant = await db.lolMatchParticipant.createNew(
                    matchId, participantInfo.teamId, participantInfo.championId,
                    participantInfo.summonerName, participantInfo.accountId,
                );

                participantMapping[participantId] = participant.id;
            } catch (sqlError) {
                this.errors = `Error saving lol_match_participant to DB - ${sqlError.message}`;
                this.logErrors();
                console.error(sqlError);
                return this;
            }
        }

        // and finally create a determine roles job
        let payload = { matchId, participantMapping };
        try {
            await db.jobs.createNewJob(jobTypes.DETERMINE_LOL_MATCH_ROLES, payload);
        } catch (sqlError) {
            this.errors = `SQL error when creating determine roles job - ${sqlError.message}`;
            this.logErrors();
            console.error(sqlError);
            return this;
        }

        return this;
    }

}

module.exports = FetchLolMatchInfoJob;
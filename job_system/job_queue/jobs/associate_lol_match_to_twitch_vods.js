const Job = require('./job');
const db = require('../../../database');
const moment = require('moment');

/**
 * Job to find all twitch vods that this lol match was played on.
 *
 * PAYLOAD: {
 *      matchId:
 * }
 * matchId: database id of lol_match we are associating
 *
 */
class AssociateLolMatchToTwitchVodsJob extends Job {
    get matchId() {
        return this.payload.matchId;
    }

    async run() {
        let lolMatch;
        try {
            lolMatch = await db.lolMatches.getById(this.matchId);
        } catch (sqlError) {
            this.errors = `SQL Error while finding lol match - ${sqlError.message}`;
            console.error(sqlError);
            return this;
        }

        let matchParticipants;
        try {
            matchParticipants = await db.lolMatchParticipant.getByMatchId(this.matchId);
        } catch (sqlError) {
            this.errors = `SQL Error while finding lol match participants - ${sqlError.message}`;
            console.error(sqlError);
            return this;
        }
        let nativeSummonerIds = matchParticipants.map(participant => participant.native_summoner_id);

        let twitchAccounts;
        try {
            twitchAccounts = await db.twitchAccounts.getByNativeSummonerIds(nativeSummonerIds);
        } catch (sqlError) {
            this.errors = `SQL Error while finding twitch accounts - ${sqlError.message}`;
            console.error(sqlError);
            return this;
        }

        if (twitchAccounts === undefined || twitchAccounts.length === 0) {
            this.errors = `Error, no twitch accounts found in this Lol match`;
            return this;
        }

        let matchStart = lolMatch.started_at;
        let matchEnd = lolMatch.ended_at;

        for (let twitchAccountIndex in twitchAccounts) {
            let twitchAccount = twitchAccounts[twitchAccountIndex];

            let twitchVod;
            try {
                twitchVod = await db.twitchVods.findVodPlayedDuringPeriodByAccount(matchStart, matchEnd, twitchAccount.id);
            } catch (sqlError) {
                this.errors = `SQL Error while finding twitch vod - ${sqlError.message}`;
                console.error(sqlError);
                return this;
            }
            if (twitchVod === undefined) {
                continue;
            }

            let twitchVodLolMatchRelation;
            try {
                twitchVodLolMatchRelation = await db.lolMatchTwitchVods.findByMatchAndVodId(this.matchId, twitchVod.id);
            } catch (sqlError) {
                this.errors = `SQL Error while finding twitchVodLolMatch relation - ${sqlError.message}`;
                console.error(sqlError);
                return this;
            }
            if (twitchVodLolMatchRelation !== undefined) {
                continue;
            }

            let durationToMatchStart = moment.duration(matchStart.diff(twitchVod.started_at));
            let secondsFromVodStartToMatchStart = Math.round(durationToMatchStart.as('seconds'));

            try {
                await db.lolMatchTwitchVods.createNew(this.matchId, twitchVod.id, secondsFromVodStartToMatchStart);
            } catch (sqlError) {
                this.errors = `SQL Error while creating twitchVodLolMatch relation - ${sqlError.message}`;
                console.error(sqlError);
                return this;
            }

        }

        return this;
    }

}

module.exports = AssociateLolMatchToTwitchVodsJob;
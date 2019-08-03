const Job = require('./job');
const db = require('../../database');
const moment = require('moment');

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
            this.logErrors();
            console.error(sqlError);
            return this;
        }

        let matchParticipants;
        try {
            matchParticipants = await db.lolMatchParticipant.findByMatchId(this.matchId);
        } catch (sqlError) {
            this.errors = `SQL Error while finding lol match participants - ${sqlError.message}`;
            this.logErrors();
            console.error(sqlError);
            return this;
        }
        let nativeSummonerIds = matchParticipants.map(participant => participant.native_summoner_id);

        let twitchAccounts;
        try {
            twitchAccounts = await db.twitchAccounts.getByNativeSummonerIds(nativeSummonerIds);
        } catch (sqlError) {
            this.errors = `SQL Error while finding twitch accounts - ${sqlError.message}`;
            this.logErrors();
            console.error(sqlError);
            return this;
        }

        if (twitchAccounts === undefined || twitchAccounts.length === 0) {
            this.errors = `Error, no twitch accounts found in this Lol match`;
            this.logErrors();
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
                this.logErrors();
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
                this.logErrors();
                console.error(sqlError);
                return this;
            }
            if (twitchVodLolMatchRelation !== undefined) {
                continue;
            }

            let durationToMatchStart = moment.duration(matchStart.diff(twitchVod.started_at));
            let secondsFromVodStartToMatchStart = Math.round(durationToMatchStart.as('seconds'));
            let loadingTimeOffset = 120;
            // Lol matches take a while to load, and take over a minute from actual start for anything to happen
            // We add an offset to hopefully link to less load screens, and get directly into action;
            let vodTimestamp = `?t=${secondsFromVodStartToMatchStart + loadingTimeOffset}s`;

            try {
                await db.lolMatchTwitchVods.createNew(this.matchId, twitchVod.id, vodTimestamp);
            } catch (sqlError) {
                this.errors = `SQL Error while creating twitchVodLolMatch relation - ${sqlError.message}`;
                this.logErrors();
                console.error(sqlError);
                return this;
            }

        }

        return this;
    }

}

module.exports = AssociateLolMatchToTwitchVodsJob;
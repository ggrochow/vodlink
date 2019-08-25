const { PythonShell } = require('python-shell');
const Job = require('./job');
const jobTypes = require('../job_types');
const db = require('../../../database');
const lolApi = require('../../../external_apis/lol');
const lolData = require('../../../lol_data');

const pythonScriptDirPath = 'python';
const pythonScriptPath = 'determine_roles.py';
const pythonPath = process.env.PYTHON_PATH;

/**
 * Job to determine each participants roles in a LoL match. Needed due to the inaccuracy of api results
 * LoL api role/lane reporting is inaccurate, so we use a python library roleMl to help determine roles
 *
 * PAYLOAD: {
 *     matchId:
 *     participantMapping: {
 *         participantId: id
 *     }
 * }
 *
 * matchId: database id of lol_match to determine roles for
 * participantMapping: object to identify which participantId belongs to which lol_match_participant
 *    key = nativeAPI result participantId (1-10), value = lol_match_participant databaseId
 *
 */
class DetermineLolMatchRolesJob extends Job {
    get matchId() {
        return this.payload.matchId;
    }

    get participantMapping() {
        return this.payload.participantMapping;
    }


    async run() {
        let lolMatch;
        try {
            lolMatch = await db.lolMatches.getById(this.matchId);
        } catch (sqlError) {
            this.errors = `SQL error while finding lolMatch - ${sqlError.message}`;
            this.logErrors();
            console.error(sqlError);
            return this;
        }

        if (lolMatch === undefined) {
            this.errors = `unable to find lol_match with id ${this.matchId}`;
            this.logErrors();
            return this;
        }

        let participants;

        try {
            participants = await db.lolMatchParticipant.getByMatchId(this.matchId);
        } catch (sqlError) {
            this.errors = `SQL error while finding lolMatchParticipants - ${sqlError.message}`;
            this.logErrors();
            console.error(sqlError);
            return this;
        }

        if (participants.length !== 10) {
            this.errors = 'Incorrect # of participants found for match';
            this.logErrors();
            return this;
        }

        let properRoles;
        try {
            properRoles = await this.runPythonScript(lolMatch.region, lolMatch.native_match_id);
        } catch (error) {
            this.errors = `Error running python determine roles script`;
            this.logErrors();
            console.error(error);
            return this;
        }

        // Ensure we have 2 of each role, if we have 3 of any, we know something isn't correct.
        let roleCounts = {};
        for (let participantId in properRoles) {
            let role = properRoles[participantId];
            let roleCount = roleCounts[role] || 0;
            roleCount++;

            if (roleCount === 3) {
                // No error here since we know the script isn't perfect.
                // we can just ignore here. Probably want to delete the match & participants though
                return this;
            }

            roleCounts[role] = roleCount;
        }


        for (let participantApiId in this.participantMapping) {
            let participantDbId = this.participantMapping[participantApiId];

            let roleMlRole = properRoles[participantApiId];
            let role = lolData.rolesByRoleMlRole[roleMlRole];

            try {
                await db.lolMatchParticipant.setRoleById(participantDbId, role);
            } catch (sqlError) {
                this.errors = `SQL error while setting participant role, id: ${participantDbId}, role: ${role} - ${sqlError.message}`;
                this.logErrors();
                console.error(sqlError);
                return this;
            }
        }

        let payload = {matchId: this.matchId};
        try {
            await db.jobs.createNewJob(jobTypes.ASSOCIATE_LOL_MATCH_TO_TWITCH_VOD, payload);
        } catch (sqlError) {
            this.errors = `SQL error while creating new associate job - ${sqlError.message}`;
            this.logErrors();
            console.error(sqlError);
            return this;
        }

        return this;
    }

    runPythonScript(region, matchId) {
        return new Promise( (resolve, reject) => {
            PythonShell.run(
                pythonScriptPath,
                {
                    scriptPath: pythonScriptDirPath,
                    pythonPath: pythonPath,
                    args: [
                        region,
                        matchId,
                        lolApi.API_KEY,
                    ]
                },
                (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        let json = JSON.parse(results[0]);
                        resolve(json);
                    }
                });
        });
    }

}

module.exports = DetermineLolMatchRolesJob;
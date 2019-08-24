import React from 'react';
import RoleSelect from "./matchup_search/role_select";
import MatchupSearchProgress from "./matchup_search/matchup_search_progress";
import ChampionTable from './matchup_search/champion_table'
import ResultsTable from "./matchup_search/results_table";
import LoadingSpinner from "./layout/loading_spinner";
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

const API_BASE_URL = publicRuntimeConfig.apiUrl;


class MatchupSearch extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentStep: 1,
            // step 1 = role select         step 2 = champ select
            // step 3 = opp champ select    step 4 = results
            role: null,
            playerChampion: null,
            opponentChampion: null,
            errorText: null,
            loading: null,
            championIdsByRole: {},
            oppChampionIdsByRoleAndChampId: {},
            vodLinkResults: {}
        };
    }

    fetchVodLinks() {
        let {role, playerChampion, opponentChampion} = this.state;
        let url = new URL(`${API_BASE_URL}vodLink`);
        url.searchParams.append('role', role);
        url.searchParams.append('championId', playerChampion);
        url.searchParams.append('opponentChampionId', opponentChampion);

        fetch(url.toString())
            .then(res => res.json())
            .then(json => {
                this.setState({
                    vodLinkResults: json,
                    loading: false,
                    currentStep: 4
                });
            })
            .catch(err => {
                this.setState({errorText: 'F', loading: false});
                console.error(err);
            });
    }


        fetchOppChampIdsByRoleAndPlayerChamp(championId) {
            let {role} = this.state;

            this.setState({loading: true, playerChampion: championId});

            let url = new URL(`${API_BASE_URL}opponentChampionIdsByRoleAndChampion`);
            url.searchParams.append('role', this.state.role);
            url.searchParams.append('championId', championId);

            fetch(url.toString())
                .then(res => res.json())
                .then(json => {
                    this.setState((prevState) => {
                        let champsByRoleAndChamp = prevState.oppChampionIdsByRoleAndChampId;
                        let champsByRole = champsByRoleAndChamp[role] || {};
                        champsByRole[championId] = json.championIds;
                        champsByRoleAndChamp[role] = champsByRole;

                        return {
                            loading: false,
                            currentStep: 3,
                            oppChampionIdsByRoleAndChampId: champsByRoleAndChamp
                        }
                    })
                })
                .catch(err => {
                    this.setState({errorText: 'F', loading: false});
                    console.error(err);
                })

        }

    fetchChampionIdsByRole(role) {
        this.setState({loading: true, role });

        let url = new URL(`${API_BASE_URL}championIdsByRole`);
        url.searchParams.append('role', role);

        fetch(url.toString())
            .then(res => res.json())
            .then(json => {
                this.setState((prevState) => {
                    let champIdsByRole = prevState.championIdsByRole;
                    champIdsByRole[role] = json.championIds;

                    return {
                        loading: false,
                        currentStep: 2,
                        championIdsByRole: champIdsByRole,
                    }
                });
            })
            .catch(err => {
                this.setState({ errorText: 'F', loading: false });
                console.error(err);
            })
    }

    handleProgressStepChange(step) {
        return () => {
            if (step >= this.state.currentStep) {
                return;
            }

            let { role, playerChampion, opponentChampion } = this.state;

            switch(step) {
                case 1:
                    role = null;
                case 2:
                    playerChampion = null;
                case 3:
                    opponentChampion = null;
            }

            this.setState({
                currentStep: step,
                role, playerChampion, opponentChampion
            })

        }
    }

    handleRoleSelect(role) {
        return () => {
            if (this.state.championIdsByRole[role]) {
                this.setState({
                    role,
                    currentStep: 2,
                });
                return;
            }

            this.fetchChampionIdsByRole(role);
        };
    }

    handlePlayerChampionClick(championId) {
        return () => {
            let { oppChampionIdsByRoleAndChampId, role } = this.state;
            let oppChampsByRole = oppChampionIdsByRoleAndChampId[role];
            if (oppChampsByRole && oppChampsByRole[championId]) {
                this.setState({
                    playerChampion: championId,
                    currentStep: 3
                });
                return;
            }

            this.fetchOppChampIdsByRoleAndPlayerChamp(championId);
        }
    }

    handleOpponentChampionClick(championId) {
        return () => {
            this.setState({
                opponentChampion: championId,
                loading: true
            }, this.fetchVodLinks);
        }
    }

    render() {
        let { role, playerChampion, opponentChampion, currentStep, loading, vodLinkResults } = this.state;
        let validChamps = this.state.championIdsByRole[role];
        let validOppChamps;
        let oppChampsByRole = this.state.oppChampionIdsByRoleAndChampId[role];
        if (oppChampsByRole && playerChampion) {
            validOppChamps = oppChampsByRole[playerChampion]
        }

        return (
            <div>
                <MatchupSearchProgress
                    role={role}
                    championId={playerChampion}
                    opponentId={opponentChampion}
                    currentStep={currentStep}
                    onStepClick={this.handleProgressStepChange.bind(this)}
                />

                <hr/>

                { loading && (
                    <LoadingSpinner/>
                )}

                { currentStep === 1 && !loading && (
                    <RoleSelect
                        onRoleClick={this.handleRoleSelect.bind(this)}
                    />
                )}

                { currentStep === 2 && !loading && (
                    <ChampionTable
                        onChampionClick={this.handlePlayerChampionClick.bind(this)}
                        validChamps={validChamps}
                    />
                )}

                { currentStep === 3 && !loading && (
                    <ChampionTable
                        onChampionClick={this.handleOpponentChampionClick.bind(this)}
                        validChamps={validOppChamps}
                    />
                )}

                { currentStep === 4 && !loading && (
                    <ResultsTable
                        vodLinks={vodLinkResults}
                    />
                )}

           </div>
        )
    }

}

export default MatchupSearch;
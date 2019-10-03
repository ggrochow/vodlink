import React from 'react';
import MatchupSelect from "./matchup_search/matchup_select";
import ChampionSelectModal from "./matchup_search/champion_select_modal";
import LoadingSpinner from "./layout/loading_spinner";
import ResultsTable from "./matchup_search/results_table";
import ErrorText from "./layout/error_text";
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

const API_BASE_URL = publicRuntimeConfig.apiUrl;

class FullMatchupSearch extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            championIds: {
                allyTeam: {
                    top: null,
                    mid: null,
                    bot: null,
                    jungle: null,
                    support: null
                },
                enemyTeam: {
                    top: null,
                    mid: null,
                    bot: null,
                    jungle: null,
                    support: null
                }
            },
            streamerRole: null,
            champSelectModal: false,
            loading: false,
            errorText: null,
            page: 0,
            results: null,
        }
    };

    handleModalChampionClick(championId) {
        return () => {
            this.setState(oldState => {
                let championIds = oldState.championIds;
                let { team, role } = oldState.champSelectModal;

                championIds[team][role] = championId;

                return {
                    championIds,
                    champSelectModal: false
                }
            }, this.tryFetchVodLinks)
        }
    }

    handleRemoveChampion(team, role) {
        if (this.state.loading) {
            return;
        }
        return () => {
            this.setState(oldState => {
                let championIds = oldState.championIds;
                championIds[team][role] = null;

                return {
                    championIds
                }
            }, this.tryFetchVodLinks)
        }
    }

    handleMatchupChampionClick(team, role) {
        if (this.state.loading) {
            return;
        }
        return () => {
            this.setState({
                champSelectModal: { team, role }
            });
        }
    }

    handleMatchupRoleClick(role) {
        if (this.state.loading) {
            return;
        }
        return () => {
            this.setState({streamerRole: role}, this.tryFetchVodLinks);
        }
    }

    closeModal() {
        this.setState({champSelectModal: false});
    }

    tryFetchVodLinks() {
        if (!this.canMakeMatchupRequest()) {
            return;
        }

        this.setState({ loading: true, errorText: null });
        let streamerRole = this.state.streamerRole;
        this.makeMatchupRequest()
            .then(res => res.json())
            .then(json => {
                json.map(res => {
                    res[`ally_${streamerRole}_champion`] = res.streamer_champion;
                    res[streamerRole] = streamerRole;
                    return res;
                });
                this.setState({
                    results: json,
                    loading: false,
                });
            })
            .catch(() => {
                this.setState({
                    loading: false,
                    results: null,
                    errorText: 'Server Error while fetching matchup results, try again later.'
                })
            })
    }

    getMatchupRequestParams() {
        let { championIds, streamerRole, page } = this.state;
        return {
            streamerRole,
            page,
            ally_top: championIds.allyTeam.top,
            ally_jungle: championIds.allyTeam.jungle,
            ally_mid: championIds.allyTeam.mid,
            ally_support: championIds.allyTeam.support,
            ally_bot: championIds.allyTeam.bot,
            enemy_top: championIds.enemyTeam.top,
            enemy_jungle: championIds.enemyTeam.jungle,
            enemy_mid: championIds.enemyTeam.mid,
            enemy_support: championIds.enemyTeam.support,
            enemy_bot: championIds.enemyTeam.bot,
        }
    }

    canMakeMatchupRequest() {
        let { streamerRole, championIds } = this.state;

        if (streamerRole === null) {
            return false
        }

        let championIdArray = [];
        ['allyTeam', 'enemyTeam'].forEach(team => {
            for (let role in championIds[team]) {
                let championId = championIds[team][role];
                if (championId) {
                    championIdArray.push(championId);
                }
            }
        });

    if (championIdArray.length === 0) {
            return false;
        }

        return true;
    }

    makeMatchupRequest() {
        let body = this.getMatchupRequestParams();
        let url = new URL(`${API_BASE_URL}full_matchup_vodlinks`);
        return fetch(url.toString(),{
            method: 'POST', // Want to use get, but we have a body.
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        })

    }


    render() {
        let {
            championIds, streamerRole, champSelectModal, results, loading, errorText
        } = this.state;

        return (
            <div>
                <MatchupSelect
                    championIds={championIds}
                    streamerRole={streamerRole}
                    onRemoveChampion={this.handleRemoveChampion.bind(this)}
                    onChampionClick={this.handleMatchupChampionClick.bind(this)}
                    onRoleSelect={this.handleMatchupRoleClick.bind(this)}
                />

                { champSelectModal && (
                    <ChampionSelectModal
                        team={champSelectModal.team}
                        role={champSelectModal.role}
                        closeModal={this.closeModal.bind(this)}
                        onChampionClick={this.handleModalChampionClick.bind(this)}
                    />
                )}

                { results === null && errorText === null && (
                    <div className='help'>
                        <h3>How To</h3>
                        <p>
                            Select a matchup by clicking on the empty champion portraits and selecting a champ for as
                            many roles as you want.
                            <br/>
                            The top row is your team, the bottom row is the enemy team. The more roles you select,
                            the less likely you are to have results.
                            <br/>
                            Select the role you want to watch by clicking the role icon. The gold border indicates
                            which roles perspective you'd like to watch.
                            <br/>
                            Select a role and at least one champion to begin your search.
                        </p>
                    </div>
                )}

                { errorText !== null && (
                    <ErrorText>
                        { errorText }
                    </ErrorText>
                )}

                { results && results.length === 0 && (
                    <div className='no_results_text'>
                        <h2>
                            No Results Found for this Matchup
                        </h2>
                        <p>
                            To request a streamer gets added to our list, please fill out <a href='https://forms.gle/PEi5nuVxyANukrhB6'>this form.</a>
                        </p>
                    </div>

                )}

                { loading === true && (
                    <LoadingSpinner/>
                )}

                { results && results.length >= 1 && loading === false && (
                    <div>
                        <ResultsTable
                            vodLinks={results}
                        />
                    </div>
                )}

                {/*language=CSS*/}
                <style jsx>{`
                    .help {
                        text-align: center;
                    }
                    .no_results_text { 
                        text-align: center;
                    }
                `}</style>
            </div>
        )
    }
}

export default FullMatchupSearch;
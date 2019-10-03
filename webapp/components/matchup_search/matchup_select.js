import { lolRoles, lolRoleImageUrl, championImageUrlById, capitalize } from "../../utils";

const MatchupSelect = (props) => {
    let {championIds, streamerRole} = props;
    return (
        <div className='container'>
            <div className='allyTeam'>
                {lolRoles.map(role => (
                    <div
                        className='champion'
                        key={`ally_${role}`}
                    >
                        { championIds.allyTeam[role] && (
                            <div className='x' onClick={props.onRemoveChampion('allyTeam', role)} />
                        )}
                        <img
                            className={streamerRole === role ? 'active' : ''}
                            src={championImageUrlById(championIds.allyTeam[role])}
                            alt={capitalize(role)}
                            title={capitalize(role)}
                            onClick={props.onChampionClick('allyTeam', role)}
                        />
                    </div>
                ))}
            </div>
            <div className='roles'>
                {lolRoles.map(role => (
                    <div className={role} key={role}>
                        <img
                            src={lolRoleImageUrl(role)}
                            alt={capitalize(role)}
                            title={capitalize(role)}
                            onClick={props.onRoleSelect(role)}
                        />
                    </div>
                ))}
            </div>
            <div className='enemyTeam'>
                {lolRoles.map(role => (
                    <div className='champion' key={`ally_${role}`}>
                        { championIds.enemyTeam[role] && (
                            <div className='x' onClick={props.onRemoveChampion('enemyTeam', role)} />
                        )}
                        <img
                            src={championImageUrlById(championIds.enemyTeam[role])}
                            alt={capitalize(role)}
                            title={capitalize(role)}
                            onClick={props.onChampionClick('enemyTeam', role)}
                        />

                    </div>
                ))}
            </div>

            {/*language=CSS*/}
            <style jsx>{`
                .container {
                    display: flex;
                    flex-flow: column nowrap;
                    width: 75%;
                    max-width: 750px;
                    min-width: 400px;
                    margin: 0 auto 30px auto;
                }

                .container div {
                    display: flex;
                    flex-wrap: nowrap;
                    justify-content: space-between;
                    margin-top: 10px;
                }

                img {
                    max-width: 75px;
                    max-height: 75px;
                    cursor: pointer;
                }

                .champion img {
                    border: 3px solid black;
                }

                .champion img.active {
                    border: 3px solid #c8aa6e;
                }

                div.x {
                    position: relative;
                    width: 23px;
                    height: 23px;
                    border: 2px solid #eef5df;
                    background-color: #ff5248;
                    border-radius: 50%;
                    top: -17px;
                    left: 15px;
                    margin-left: -27px;
                }
                

                .x::before, .x::after {
                    position: absolute;
                    top: 10px;
                    left: 5px;
                    width: 13px;
                    height: 3px;
                    content: "";
                    background-color: #eef5df;
                }

                .x::before {
                    transform: rotate(-45deg);
                }

                .x::after {
                    transform: rotate(45deg);
                }

                .x:hover {
                    cursor: pointer;
                }

                .x:hover::before, .x:hover::after {
                    background-color: #8e2e29;
                }
            `}</style>
        </div>
    )
};

export default MatchupSelect;
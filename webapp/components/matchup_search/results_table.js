import { matchHistoryLink, twitchVodLink, lolRoles } from "../../utils";
import { championImageUrlById, championNameById } from "../../utils";

const ChampionImageRow = (props) => {
    let { championIds, streamerChampion } = props;

    return (
        <div>
            { lolRoles.map(role => {
                let championId = championIds[role];
                let isStreamerChamp = streamerChampion === championId;
                let championName = championNameById(championId);
                return (
                    <img
                        key={`${role}_${championId}`}
                        className={`champion ${isStreamerChamp ? 'streamer' : ''}`}
                        src={championImageUrlById(championId)}
                        alt={championName}
                        title={championName}
                    />
                )

            })}

            {/*language=CSS*/}
            <style jsx>{`
                .champion {
                    max-height: 25px;
                    max-width: 25px;
                    border: 2px solid black;
                }
                .champion.streamer {
                    border-color: #c8aa6e;
                }
                
            `}</style>
        </div>
    )
};

const ResultsTable = (props) => (
    <table>
        <thead>
            <tr>
                <th>Channel</th>
                <th>Summoner</th>
                <th>Allies</th>
                <th>Enemies</th>
                <th/>
                <th/>
            </tr>
        </thead>
        <tbody>
            {
                props.vodLinks.map((vodLink) => {
                    let {
                        id, region,
                        streamer_name: streamerName, vod_offset_seconds: vodOffsetSeconds,
                        vod_id: vodId, summoner_name: summonerName, native_match_id: nativeMatchId,
                        streamer_champion: streamerChampion
                    } = vodLink;

                    let allyChampIds = {
                        top: vodLink.ally_top_champion,
                        jungle: vodLink.ally_jungle_champion,
                        mid: vodLink.ally_mid_champion,
                        support: vodLink.ally_support_champion,
                        bot: vodLink.ally_bot_champion,
                    };
                    let enemyChampIds = {
                        top: vodLink.enemy_top_champion,
                        jungle: vodLink.enemy_jungle_champion,
                        mid: vodLink.enemy_mid_champion,
                        support: vodLink.enemy_support_champion,
                        bot: vodLink.enemy_bot_champion,
                    };

                    let vodUrl = twitchVodLink(vodId, vodOffsetSeconds);
                    let historyUrl = matchHistoryLink(region, nativeMatchId);

                    return  (
                        <tr key={id}>
                            <td>
                                {streamerName}
                            </td>
                            <td>
                                {summonerName}
                            </td>
                            <td>
                                <ChampionImageRow
                                    streamerChampion={streamerChampion}
                                    championIds={allyChampIds}
                                />
                            </td>
                            <td>
                                <ChampionImageRow
                                    championIds={enemyChampIds}
                                />
                            </td>
                            <td>
                                <a href={vodUrl} target='_blank'>VodLink</a>
                            </td>
                            <td>
                                <a href={historyUrl} target='_blank'>Match History</a>
                            </td>
                        </tr>
                    )
                })
            }
        </tbody>


        {/*language=CSS*/}
        <style jsx> {`
            table { 
                width: 100%; 
                border-collapse: collapse; 
            }
            tr:nth-of-type(odd) { 
                background: #eee; 
            }
            th { 
                background: #333; 
                color: white; 
                font-weight: bold; 
            }
            td, th { 
                padding: 0.25em; 
                border: 1px solid #ccc; 
                text-align: center; 
                vertical-align: middle;
            }
        `}</style>

    </table>
);

export default ResultsTable
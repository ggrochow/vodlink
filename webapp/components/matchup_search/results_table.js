import {matchHistoryLink, twitchVodLink} from "../../utils";

const ResultsTable = (props) => (
    <table>
        <thead>
            <tr>
                <th>Channel</th>
                <th>Account</th>
                <th>Opponent</th>
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
                        vod_id: vodId, summoner_name: summonerName, opp_name: opponentName,
                        native_match_id: nativeMatchId, streamer_history_id: streamerHistoryId,
                    } = vodLink;
                    let vodUrl = twitchVodLink(vodId, vodOffsetSeconds);
                    let historyUrl = matchHistoryLink(region, nativeMatchId, streamerHistoryId);
                   return  (
                        <tr key={id}>
                            <td>{streamerName}</td>
                            <td>{summonerName}</td>
                            <td>{opponentName}</td>
                            <td><a href={vodUrl} target='_blank'>VodLink</a></td>
                            <td><a href={historyUrl} target='_blank'>Match History</a></td>
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
                text-align: left; 
            }
        `}</style>

    </table>
);

export default ResultsTable
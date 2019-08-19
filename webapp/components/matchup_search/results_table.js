import { twitchVodLink } from "../../utils";

const ResultsTable = (props) => (
    <table>
        <tbody>
            {
                props.vodLinks.map((vodLink, index) => {
                    let { streamer_name, vod_offset_seconds, vod_id} = vodLink;
                    let vodUrl = twitchVodLink(vod_id, vod_offset_seconds);
                   return  (
                        <tr key={index}>
                            <td>{streamer_name}</td>
                            <td><a href={vodUrl} target='_blank'>{vodUrl}</a></td>
                        </tr>
                    )
                })
            }
        </tbody>
    </table>
);

export default ResultsTable
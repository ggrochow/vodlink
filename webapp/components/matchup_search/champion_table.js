import React from 'react';
import lolData from "../../../lol_data";

let championIds = Object.keys(lolData.championById);

const ChampionTable = (props) => {
    let validChamps = props.validChamps || championIds;

    return (

        <div>
            <div className='champTable'>
                {validChamps.map(id => {
                    let champInfo = lolData.championById[id];

                    return (
                        <img
                            key={id}
                            src={champInfo.imageUrl}
                            alt={champInfo.name}
                            title={champInfo.name}
                            onClick={props.onChampionClick(id)}
                        />
                    )
                })}
            </div>

            {/*language=CSS*/}
            <style jsx>{`
                .champTable {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    align-content: center;
                }
                
                img {
                    max-height: 75px;
                    max-width: 75px;
                    cursor: pointer;
                }

            `}</style>
        </div>
    )
};


export default ChampionTable;

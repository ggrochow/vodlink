import React from 'react';
import lolData from "../../../lol_data";

let championIds = Object.keys(lolData.championById);

function sortByName(a, b) {
    let nameA = lolData.championById[a].name.toLowerCase();
    let nameB = lolData.championById[b].name.toLowerCase();

    if (nameA < nameB) {
        return -1;
    }
    if (nameA > nameB) {
        return 1;
    }

    return 0;
}

const ChampionTable = (props) => {
    let validChamps = (props.validChamps || championIds).sort(sortByName);

    return (

        <div>
            <div className='champTable'>
                {validChamps.map(id => {
                    let champInfo = lolData.championById[id];

                    return (
                        <span className='imgContainer'>
                            <img
                                key={id}
                                src={champInfo.imageUrl}
                                alt={champInfo.name}
                                title={champInfo.name}
                                onClick={props.onChampionClick(id)}
                            />
                        </span>
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
                
                .imgContainer {
                    height: 75px;
                    width: 75px;
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

import React from 'react';
import lolData from "../../../lol_data";

let championIds = Object.keys(lolData.championById);

class ChampionTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {searchText: ''};
    }

    handleSearchInput(e) {
        this.setState({searchText: e.target.value})
    }

    filteredChampionList() {
        let validChamps = this.props.validChamps || championIds;

        let searchText = this.state.searchText.toLowerCase();
        if (searchText.length < 2) {
            return validChamps;
        }

        return validChamps.filter(id => {
            let champName = lolData.championById[id].name.toLowerCase();
            return champName.indexOf(searchText) !== -1;
        })
    }


    render() {

        return (

            <div>
                <div className='search'>
                    <label> Search
                        <input type="text" onChange={ e => this.handleSearchInput(e) }/>
                    </label>
                </div>

                <div className='champTable'>
                    {this.filteredChampionList().map(id => {
                        let champInfo = lolData.championById[id];

                        return (
                            <img
                                key={id}
                                src={champInfo.imageUrl}
                                alt={champInfo.name}
                                title={champInfo.name}
                                onClick={this.props.onChampionClick(id)}
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

                    img.disabled {
                        filter: grayscale(1);
                    }
                    
                `}</style>
            </div>
        )
    };
}

export default ChampionTable;

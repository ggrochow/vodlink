import React from 'react';
import Modal from "../layout/modal";
import ChampionTable from "./champion_table";
import {capitalize} from "../../utils";
import lolData from "../../../utils/lol_data";

let championIds = Object.keys(lolData.championById);

class ChampionSelectModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            searchText: ''
        }
    }

    onSearchInput(e) {
        let searchText = e.target.value;
        this.setState({searchText});
    }

    filteredChampionList() {
        let searchText = this.state.searchText;
        if (searchText.length < 1) {
            return championIds;
        }

        return championIds.filter(id => {
            let name = lolData.championById[id].name.toLowerCase();
            return name.indexOf(searchText.toLowerCase()) !== -1;
        })
    }

    render() {
        let {team, role, closeModal, onChampionClick} = this.props;
        let {searchText} = this.state;
        let teamString = team === 'allyTeam' ? 'Ally' : 'Enemy';

        return (
            <Modal
                closeModal={closeModal}
            >
                <div className='info'>
                    <p>{teamString} {capitalize(role)} Champion</p>
                    <input placeholder='Search...' value={searchText} onChange={this.onSearchInput.bind(this)}/>
                </div>

                <ChampionTable
                    validChamps={this.filteredChampionList()}
                    onChampionClick={onChampionClick}
                    imageSize={60}
                />

                {/*language=CSS*/}
                <style jsx>{`
                    .info {
                        display: flex;
                        justify-content: space-around;
                        align-items: stretch;
                    }

                    p {
                        font-size: 1.1em;
                        padding-bottom: 10px;
                    }

                    input {
                        border: 2px solid #DDD;
                        margin: 10px 0 20px 0;
                        padding: 0.25em 1em;
                        width: 250px;
                    }
                `}</style>
            </Modal>
        )
    }
}

export default ChampionSelectModal;
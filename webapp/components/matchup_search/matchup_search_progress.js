import { lolRoleImageUrl } from "../../utils";
import lolData from '../../../lol_data';

const ProgressBox = (props) => {
    return (
        <div >

            <p>{ props.title }</p>
            <div className={`imgBox ${props.active ? 'active' : '' }`}>
                { props.imageSrc &&
                    <img
                        src={props.imageSrc}
                        alt={props.title}
                        onClick={props.onClick}
                    />
                }
            </div>

            {/*language=CSS*/}
            <style jsx>{`
            .imgBox {
                border: 0.25em solid black;
                height: 80px;
                width: 80px;
            }
            
            .imgBox.active {
                border-color: greenyellow;
            }
            
            img {
                max-width: 100%;
                height: auto;
                cursor: pointer;
            }
            
            p {
                text-align: center;
            }
        `}</style>
        </div>
    );
};

const MatchupSearchProgress = (props) => {
    let { role, championId, opponentId, onStepClick, currentStep } = props;
    let champion = lolData.championById[championId];
    let opponentChampion = lolData.championById[opponentId];

    return (
        <div>
            <ProgressBox
                active={currentStep === 1}
                title={'Role'}
                imageSrc={lolRoleImageUrl(role)}
                onClick={onStepClick(1)}
            />

            <ProgressBox
                active={currentStep === 2}
                title={'Champion'}
                imageSrc={champion && champion.imageUrl}
                onClick={onStepClick(2)}
            />

            <ProgressBox
                active={currentStep === 3}
                title={'Opponent'}
                imageSrc={opponentChampion && opponentChampion.imageUrl}
                onClick={onStepClick(3)}
            />

            {/*language=CSS*/}
            <style jsx>{`
            div {
                display: flex;
                justify-content: space-around;
            }
        `}</style>

        </div>
    )
};



export default MatchupSearchProgress;

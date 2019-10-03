const Modal = (props) => {
    let modalHeight = props.height || 650;
    let modalWidth = props.width || 1100;

    return (
        <div>
            <div className='modal'>
                <div className='x'
                    onClick={props.closeModal}
                />
                <div className='modal_content'>
                    { props.children }
                </div>
            </div>
            <div className='modal_overlay'
                onClick={props.closeModal}
            > </div>
            {/*language=CSS*/}
            <style jsx>{`
                .modal {
                    z-index: 110;
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    
                    width: ${modalWidth}px;
                    max-width: 90%;
                    height: ${modalHeight}px;
                    max-height: 95%;
                    box-shadow: 0 0 60px 10px rgba(0, 0, 0, 0.9);
                    background: white;
                    
                    margin: 10px;
                }
                
                .modal_content {
                    position: absolute;
                    top: 20px;
                    width: 100%;
                    height: 96%;
                    overflow: auto;
                }
                
                .modal_overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.6);

                }
                
                div.x {
                    position: relative;
                    width: 23px;
                    height: 23px;
                    border: 2px solid #eef5df;
                    background-color: #ff5248;
                    border-radius: 50%;
                    top: -12px;
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

export default Modal;
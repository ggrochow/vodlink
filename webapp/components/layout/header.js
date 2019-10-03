
const Header = () => (
    <div className='header'>
        <h1>LoL VodLink</h1>

        {/*language=CSS*/}
        <style jsx>{`
            .header {
                display: flex;
                justify-content: space-around;
                flex-wrap: nowrap;
                align-items: baseline;
                
                min-width: 400px;
                width: 50%;
                
                margin: 10px auto;
            }
        `}</style>
    </div>
);

export default Header;
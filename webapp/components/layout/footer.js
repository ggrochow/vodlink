import RequestStreamerText from "./request_streamer_text";
import LegalText from "./legal_text";

const Footer = () => (
    <div>
        <RequestStreamerText/>
        <hr/>
        <LegalText/>

        {/*language=SCSS*/}
        <style jsx>{`
            div {
            
            }
        `}</style>

    </div>
);

export default Footer;
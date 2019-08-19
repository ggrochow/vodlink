import Head from 'next/head';
import Header from './layout/header';
import Footer from './layout/footer';


const Layout = props => (
    <div>
        <Head>
            <title>{props.title}</title>
        </Head>

        <Header/>
            {props.children}
        <Footer/>

        {/*language=SCSS*/}
        <style jsx global>{`
            body {
                background: #f9f9f9;
                width: 75%;
                margin: auto;
            }
        `}</style>
    </div>
);

export default Layout;


import Head from 'next/head';
import Footer from "./layout/footer";
import Header from "./layout/header";

const Layout = props => (
    <div>
        <Head>
            <title>{props.title}</title>
        </Head>

        {/*<div className='header'>*/}
        {/*    <Header/>*/}
        {/*</div>*/}

        <div className='body'>
            {props.children}
        </div>

        <div className='footer'>
            <Footer/>
        </div>


        {/*language=SCSS*/}
        <style jsx>{`
          div.body {
            min-height: calc(100vh - 100px);
          }
          
          div.footer {
            height: 50px;
          }
        `}</style>

        {/*language=SCSS*/}
        <style jsx global>{`
            body {
                background: #f9f9f9;
                width: 75%;
                height: 100%;
                margin: auto;
            }
            
            p, h1, h2, h3, h4, h5, hr {
              color: #333;
            }
            
            hr {
              margin: 1em;
            }
        `}</style>
    </div>
);

export default Layout;


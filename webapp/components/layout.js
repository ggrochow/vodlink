import Head from 'next/head';
import Footer from "./layout/footer";

const Layout = props => (
    <div>
        <Head>
            <title>{props.title}</title>
        </Head>

        <div className='body'>
            {props.children}
        </div>

        <div className='footer'>
            <Footer/>
        </div>


        {/*language=SCSS*/}
        <style jsx>{`
          div.body {
            min-height: calc(100vh - 150px);
          }
          
          div.footer {
            height: 100px;
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


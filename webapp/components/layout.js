import Head from 'next/head';

const Layout = props => (
    <div>
        <Head>
            <title>{props.title}</title>
        </Head>

        {props.children}

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


import React from 'react'
import Document, { Head, Main, NextScript } from 'next/document'
import getConfig from 'next/config';
import * as snippet from '@segment/snippet'
const { publicRuntimeConfig } = getConfig();

const segmentApiKey = publicRuntimeConfig.segmentWriteKey;

export default class extends Document {
    static getInitialProps ({ renderPage }) {
        const { html, head, errorHtml, chunks } = renderPage();
        return { html, head, errorHtml, chunks }
    }

    renderSnippet () {
        const opts = {
            apiKey: segmentApiKey,
            // note: the page option only covers SSR tracking.
            // Page.js is used to track other events using `window.analytics.page()`
            page: true
        };

        return snippet.min(opts);
    }

    render () {
        return (
            <html>
            <Head>
                {/* Inject the Segment snippet into the <head> of the document  */}
                <script dangerouslySetInnerHTML={{ __html: this.renderSnippet() }} />
            </Head>
            <body>
            <Main />
            <NextScript />
            </body>
            </html>
        )
    }
}
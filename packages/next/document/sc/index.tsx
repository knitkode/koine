import React from "react";
/* ? eslint-disable @next/next/no-document-import-in-page */
import NextDocument, {
  DocumentContext,
  DocumentInitialProps,
  Html,
  Head,
  Main,
  NextScript,
} from "next/document";
import { Meta, NoJs } from "@koine/react";
import { ServerStyleSheet } from "styled-components";

/**
 * Next Document wrapper for `styled-components` based projects
 *
 * For typescript safety of this component
 * @see https://bit.ly/3ceuF8m
 *
 * @example
 *
 * in your `myapp/pages/_document.tsx`:
 * ```tsx
 * export { Document as default } from "@koine/next/document/sc";
 * ```
 */
export class Document extends NextDocument {
  static override async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await NextDocument.getInitialProps(ctx);
      return {
        ...initialProps,
        // @ts-expect-error FIXME: have they changed type?
        styles: (
          <React.Fragment>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </React.Fragment>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  override render() {
    const { locale, defaultLocale } = this.props.__NEXT_DATA__;

    return (
      <Html lang={locale || defaultLocale} className="no-js">
        <Head>
          <Meta />
          <NoJs />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default Document;

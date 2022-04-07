import NextDocument, { Html, Head, Main, NextScript } from "next/document";
import { Meta, NoJs } from "@koine/react";

/**
 * For typescript safety of this component
 *
 * @see https://bit.ly/3ceuF8m
 */
export class Document extends NextDocument {
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

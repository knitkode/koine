import React from "react";
import NextDocument, { Html, Head, Main, NextScript } from "next/document";
import { Meta, NoJs } from "@koine/react";

/**
 * Next Document wrapper for bare projects
 *
 * @example
 *
 * in your `myapp/pages/_document.tsx`:
 * ```tsx
 * export { Document as default } from "@koine/next/document";
 * ```
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

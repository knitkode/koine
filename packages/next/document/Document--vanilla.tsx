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
import { Meta, NoJs } from "@koine/react/index.js";
import {
  getInitialThemeFromRequest,
  ThemeVanillaValue,
} from "@koine/react/styles/index.js";

/**
 */
export class DocumentVanilla extends NextDocument {
  static override async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps & { theme: ThemeVanillaValue }> {
    const initialProps = await NextDocument.getInitialProps(ctx);
    return {
      ...initialProps,
      theme: getInitialThemeFromRequest(
        ctx.req?.headers.cookie /*  || document?.cookie */ || ""
      ),
    };
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

import NextDocument, {
  Head, // DocumentContext,
  // type DocumentInitialProps,
  Html,
  Main,
  NextScript,
} from "next/document";
import React from "react";
import Meta from "@koine/react/Meta";
import NoJs from "@koine/react/NoJs";

// import { getInitialThemeFromRequest, ThemeVanillaValue } from "@koine/react/sc"; // FIXME: this should be imported from another entrypoint

/**
 * Next Document wrapper for `css/tailwind` based projects
 *
 * Uses cookie to manage the current theme
 *
 * @example
 *
 * in your `myapp/pages/_document.tsx`:
 * ```tsx
 * export { Document as default } from "@koine/next/document/css";
 * ```
 */
export class Document extends NextDocument {
  // static override async getInitialProps(
  //   ctx: DocumentContext
  // ): Promise<DocumentInitialProps & { theme: ThemeVanillaValue }> {
  //   const initialProps = await NextDocument.getInitialProps(ctx);
  //   return {
  //     ...initialProps,
  //     theme: getInitialThemeFromRequest(
  //       ctx.req?.headers.cookie /*  || document?.cookie */ || ""
  //     ),
  //   };
  // }

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

import type { I18nCompiler } from "../../compiler/types";

export default ({}: I18nCompiler.AdapterArg<"next">) => `
"use client";

import Head from "next/head";
import type { I18n } from "./types";

export type I18nHeadProps = {
  alternates?: I18n.Alternates;
};

/**
 * **For Pages Router only**
 */
export const I18nHead = (props: I18nHeadProps) => {
  const { alternates = {} } = props;

  return (
    <Head key="I18nHead">
      {Object.keys(alternates).map((locale) => (
        <link
          rel="alternate"
          hrefLang={locale}
          href={alternates[locale]}
          key={"alternate-" + locale}
        />
      ))}
    </Head>
  );
};

export default I18nHead;
`;

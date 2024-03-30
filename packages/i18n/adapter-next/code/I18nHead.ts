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
  const { "x-default": xDefault, ...others } = alternates;

  return (
    <Head key="I18nHead">
      {xDefault && (
        <link
          rel="alternate"
          hrefLang="x-default"
          href={xDefault}
          key="alternate-default"
        />
      )}
      {Object.keys(others).map((locale) => (
        <link
          rel="alternate"
          hrefLang={locale}
          href={others[locale]}
          key={"alternate-" + locale}
        />
      ))}
    </Head>
  );
};

export default I18nHead;
`;

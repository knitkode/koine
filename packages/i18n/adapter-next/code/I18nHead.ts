import type { I18nCompiler } from "../../compiler/types";

/**
 * We cannot re-use `I18nHeadTags` as NextHead component does needs HTML tags
 * to be its immediate children.
 *
 * @see https://nextjs.org/docs/pages/api-reference/components/head#use-minimal-nesting
 */
export default ({}: I18nCompiler.AdapterArg<"next">) => `
"use client";

import Head from "next/head";
import { defaultI18nMetadata } from "./defaultI18nMetadata";
import type { I18nHeadTagsProps } from "./I18nHeadTags";

export type I18nHeadProps = I18nHeadTagsProps;

/**
 * **For Pages Router only**
 *
 * @internal
 */
export const I18nHead = (props: I18nHeadProps) => {
  const { metadata = defaultI18nMetadata } = props;
  const { alternates, canonical } = metadata;

  return (
    <Head key="I18nHead">
      {canonical && (
        <link
          rel="canonical"
          href={canonical}
          key="canonical"
        />
      )}
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

// export default I18nHead;
`;

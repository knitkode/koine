import { createGenerator } from "../../compiler/createAdapter";

export default createGenerator("react", (_arg) => {
  return {
    I18nHeadTags: {
      name: "I18nHeadTags",
      ext: "tsx",
      index: true,
      content: () => /* js */ `
"use client";

import React from "react";
import { defaultI18nMetadata } from "./defaultI18nMetadata";
import type { I18n } from "./types";

export type I18nHeadTagsProps = {
  metadata?: I18n.Metadata;
};

/**
 * Renders the HTML tags to use in the \`<head>\`
 */
export const I18nHeadTags = (props: I18nHeadTagsProps) => {
  const { metadata = defaultI18nMetadata } = props;
  const { alternates, canonical } = metadata;

  return (
    <>
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
    </>
  );
};

export default I18nHeadTags;
`,
    },
  };
});

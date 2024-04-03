import type { I18nCompiler } from "../../compiler/types";

export default ({}: I18nCompiler.AdapterArg<"next">) => `
"use client";

import type { AppProps } from "next/app";
import { defaultI18nMetadata } from "./defaultI18nMetadata";
import { defaultLocale } from "./defaultLocale";
import { I18nProvider } from "./I18nProvider";
import { I18nMetadataProvider } from "./I18nMetadataProvider";
import { I18nEffects } from "./I18nEffects";
import { I18nHead } from "./I18nHead";
import type { I18n } from "./types";

/**
 * @internal
 */
export type I18nAppPropsData = {
  i18n: {
    locale: I18n.Locale;
    dictionaries: I18n.Dictionaries;
    metadata: I18n.Metadata;
  }
};

const i18nDefaults: I18nAppPropsData["i18n"] = {
  locale: defaultLocale,
  dictionaries: {},
  metadata: defaultI18nMetadata
};

type I18nAppProps =  React.PropsWithChildren<
  AppProps<I18nAppPropsData>["pageProps"]
>;

/**
 * To use in \`_app.tsx\` file wrapping your component
 * 
 * **For Pages Router only**
 * 
 * NB: Consider that when using ISR with \`fallback: true\` the first load
 * will not have any useful i18n data (App's \`pageProps\` is an empty object),
 * hence we provide a \`i18nDefaults\` object.
 * 
 * @usage
 * \`\`\`ts
 * export default function App(props: AppProps) {
 *   const { Component, pageProps } = props;
 *   
 *   return (
 *     <I18nApp {...pageProps}>
 *       <Component {...pageProps} />
 *     </I18nApp>
 *   );
 * }
 * \`\`\`
 */
export const I18nApp = (props: I18nAppProps) => {
  const { i18n, children } = props;
  const { locale, dictionaries, metadata } = i18n || i18nDefaults;
  
  return (
    <I18nProvider
      locale={locale}
      dictionaries={dictionaries}
    >
      <I18nHead metadata={metadata} />
      <I18nMetadataProvider metadata={metadata}>
        {children}
      </I18nMetadataProvider>
      <I18nEffects />
    </I18nProvider>
  );
};

export default I18nApp;
`;

import type { I18nCompiler } from "../../compiler/types";

export default ({}: I18nCompiler.AdapterArg<"next">) => `
"use client";

import type { AppProps } from "next/app";
import { defaultLocale } from "./defaultLocale";
import { I18nProvider } from "./I18nProvider";
import { I18nAlternatesProvider } from "./I18nAlternatesProvider";
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
    alternates: I18n.Alternates;
  }
};

const i18nDefaults: I18nAppPropsData["i18n"] = {
  locale: defaultLocale,
  dictionaries: {},
  alternates: {}
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
  const { locale, dictionaries, alternates } = i18n || i18nDefaults;
  
  return (
    <I18nProvider
      locale={locale}
      dictionaries={dictionaries}
    >
      <I18nHead alternates={alternates} />
      <I18nAlternatesProvider alternates={alternates}>
        {children}
      </I18nAlternatesProvider>
      <I18nEffects />
    </I18nProvider>
  );
};

export default I18nApp;
`;

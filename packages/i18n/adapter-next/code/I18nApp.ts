import type { I18nCompiler } from "../../compiler/types";

export default ({}: I18nCompiler.AdapterArg<"next">) => `
"use client";

import type { AppProps } from "next/app";
import { I18nProvider } from "./I18nProvider";
import { I18nAlternatesProvider } from "./I18nAlternatesProvider";
import { I18nEffects } from "./I18nEffects";
import { I18nHead } from "./I18nHead";
import type { I18n } from "./types";

/**
 * @internal
 */
export type I18nAppPropsData = {
  locale: I18n.Locale;
  dictionaries: I18n.Dictionaries;
  alternates: I18n.Alternates;
};

type I18nAppProps =  React.PropsWithChildren<
  AppProps<I18nAppPropsData>["pageProps"]
>;

/**
 * To use in \`_app.tsx\` file wrapping your component
 * 
 * **For Pages Router only**
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
  
  const { locale, dictionaries, alternates, children } = props;
  
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

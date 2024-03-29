import type { I18nCompiler } from "../../compiler/types";

export default ({}: I18nCompiler.AdapterArg<"next">) => `
"use client";

import type { AppProps } from "next/app";
import { I18nProvider } from "./I18nProvider";
import { I18nAlternatesProvider } from "./I18nAlternatesProvider";
import { I18nEffects } from "./I18nEffects";
import { I18nHead } from "./I18nHead";
import type { I18n } from "./types";

type I18nGetProps = {
  __locale: I18n.Locale;
  __dictionaries: I18n.Dictionaries;
  __alternates: I18n.Alternates;
};

export type I18nAppProps =  React.PropsWithChildren<
  AppProps<I18nGetProps>["pageProps"]
>;

/**
 * For Pages Router only
 */
export const I18nApp = (props: I18nAppProps) => {
  const { __locale, __dictionaries, __alternates, children } = props;
  
  return (
    <I18nProvider
      locale={__locale}
      dictionaries={__dictionaries}
    >
      <I18nHead alternates={__alternates} />
      <I18nAlternatesProvider alternates={__alternates}>
        {children}
      </I18nAlternatesProvider>
      <I18nEffects />
    </I18nProvider>
  );
};

export default I18nApp;
`;

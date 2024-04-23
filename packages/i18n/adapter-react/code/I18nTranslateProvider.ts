import type { I18nCompiler } from "../../compiler/types";

export default ({}: I18nCompiler.AdapterArg<"react">) => `
"use client";

import { useContext } from "react";
import { I18nTranslateContext } from "./I18nTranslateContext";
import { createT } from "./createT";
import { defaultLocale } from "./defaultLocale";
import type { I18n } from "./types";

export type I18nTranslateProviderProps = React.PropsWithChildren<{
  locale?: I18n.Locale;
  dictionaries?: I18n.Dictionaries;
}>;

export const I18nTranslateProvider = ({
  locale = defaultLocale,
  dictionaries = {},
  children,
}: I18nTranslateProviderProps) => {
  const parentCtx = useContext(I18nTranslateContext);
  const pluralRules = new Intl.PluralRules(locale);
  const _d = { ...parentCtx._d, ...dictionaries };
  const t = createT(_d, pluralRules, locale) as I18n.Translate;

  return (
    <I18nTranslateContext.Provider value={{ locale, t, _d }}>
      {children}
    </I18nTranslateContext.Provider>
  );
};

export default I18nTranslateProvider;
`;

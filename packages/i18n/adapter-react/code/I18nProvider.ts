import type { I18nCompiler } from "../../compiler/types";

export default ({}: I18nCompiler.AdapterArg<"react">) => `
"use client";

import { I18nContext } from "./I18nContext";
import { defaultLocale } from "./defaultLocale";
import { createT } from "./createT";
import type { I18n } from "./types";

export type I18nProviderProps = React.PropsWithChildren<{
  locale?: I18n.Locale;
  dictionaries?: I18n.Dictionaries;
}>;

export const I18nProvider = ({
  locale = defaultLocale,
  dictionaries = {},
  children,
}: I18nProviderProps) => {
  const pluralRules = new Intl.PluralRules(locale);
  const t = createT(dictionaries, pluralRules, locale) as I18n.Translate;

  return (
    <I18nContext.Provider value={{ locale, t }}>{children}</I18nContext.Provider>
  );
};

export default I18nProvider;
`;

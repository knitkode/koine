import type { I18nCompiler } from "../../compiler/types";

export default ({ config }: I18nCompiler.AdapterArg<"react">) => `
"use client";

import { I18nContext } from "./I18nContext";
import { createT } from "./createT";
import type { I18n } from "./types";

export type I18nProviderProps = React.PropsWithChildren<{
  lang?: I18n.Locale;
  namespaces?: Record<string, I18n.TranslationsDictionary>;
}>;

export const I18nProvider = ({
  lang: langProp,
  namespaces = {},
  children,
}: I18nProviderProps) => {
  const lang = langProp || "${config.defaultLocale}";
  const pluralRules = new Intl.PluralRules(lang);
  const t = createT(namespaces, pluralRules, lang) as I18n.Translate;

  return (
    <I18nContext.Provider value={{ lang, t }}>{children}</I18nContext.Provider>
  );
};

export default I18nProvider;
`;

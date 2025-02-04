import { createGenerator } from "../../compiler/createAdapter";

export default createGenerator("react", (arg) => {
  return {
    I18nTranslateContext: {
      dir: createGenerator.dirs.internal,
      name: "I18nTranslateContext",
      ext: "tsx",
      index: false,
      content: () => /* j s */ `
"use client";

import React, { createContext } from "react";
import type { I18nUtils } from "@koine/i18n";
import { defaultLocale } from "../defaultLocale";
import type { I18n } from "../types";

export type I18nTranslateContextValue = {
  t: I18n.Translate;
  locale: I18n.Locale;
  /**
   * Store to accumulate nested provided dictionaries
   */
  _d: I18nUtils.TranslationsDictionaries;
};

/**
 * @internal
 */
export const I18nTranslateContext = createContext<I18nTranslateContextValue>({
  t: ((key: string) => key) as I18n.Translate,
  locale: defaultLocale,
  _d: {} as I18nUtils.TranslationsDictionaries
});
`,
    },
    I18nTranslateProvider: {
      name: "I18nTranslateProvider",
      ext: "tsx",
      index: true,
      content: () => /* j s */ `
"use client";

import React, { useContext } from "react";
import { i18nConsole, type I18nUtils } from "@koine/i18n";
import { I18nTranslateContext } from "./internal/I18nTranslateContext";
import { setGlobalLocale } from "./internal/setGlobalLocale";
import { createT } from "./createT";
import { defaultLocale } from "./defaultLocale";
import type { I18n } from "./types";

export type I18nTranslateProviderProps = React.PropsWithChildren<{
  locale?: I18n.Locale;
  dictionaries?: I18nUtils.TranslationsDictionaries;
}>;

/**
 */
export const I18nTranslateProvider = ({
  locale = defaultLocale,
  dictionaries = {},
  children,
}: I18nTranslateProviderProps) => {

  // immediately set the current locale, this is needed alongside the same set
  // operation done in the Next.js adapters' files I18nPage and I18nLayout, as
  // those are RSC components and set the global locale variable in that context
  // (the "rsc" webpack layer), while here we set it in a client component (the
  // "ssr" webpack layer) making the locale available in all client components
  // and in the webpack-define implementation
  setGlobalLocale(locale);${createGenerator.log(arg, "I18nTranslateProvider", "setGlobalLocale", "locale")}

  const parentCtx = useContext(I18nTranslateContext);
  const _d = { ...parentCtx._d, ...dictionaries };
  const t = createT(_d, locale) as I18n.Translate;

  return (
    <I18nTranslateContext.Provider value={{ locale, t, _d }}>
      {children}
    </I18nTranslateContext.Provider>
  );
};

export default I18nTranslateProvider;
`,
    },
    useLocale: {
      name: "useLocale",
      ext: "ts",
      index: true,
      content: () => /* j s */ `
"use client";

import { useContext } from "react";
import { defaultLocale } from "./defaultLocale";
import { I18nTranslateContext } from "./internal/I18nTranslateContext";

export const useLocale = () => useContext(I18nTranslateContext).locale || defaultLocale;

export default useLocale;
`,
    },
    useT: {
      name: "useT",
      ext: "ts",
      index: true,
      content: () => /* j s */ `
"use client";

import { useContext, useMemo } from "react";
import { I18nTranslateContext } from "./internal/I18nTranslateContext";
import type { I18n } from "./types";

export const useT = <T extends I18n.TranslationsNamespace>(namespace: T) => {
  const t = useContext(I18nTranslateContext).t;
  return useMemo(
    () =>
      (key: string, ...args) =>
        (t as any)(\`\${namespace}:\${key}\`, ...args),
    [t],
  ) as I18n.TranslateNamespaced<T>;
};

export default useT;
`,
    },
  };
});

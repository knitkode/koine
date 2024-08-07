import { createGenerator } from "../../compiler/createAdapter";

export default createGenerator("react", (_arg) => {
  return {
    I18nTranslateContext: {
      name: "I18nTranslateContext",
      ext: "tsx",
      content: () => /* js */ `
"use client";

import React, { createContext } from "react";
import { defaultLocale } from "./defaultLocale";
import type { I18n } from "./types";

export type I18nTranslateContextValue = {
  t: I18n.Translate;
  locale: I18n.Locale;
  /**
   * Store to accumulate nested provided dictionaries
   */
  _d: I18n.Dictionaries;
};

/**
 * @internal
 */
export const I18nTranslateContext = createContext<I18nTranslateContextValue>({
  t: ((key: string) => key) as I18n.Translate,
  locale: defaultLocale,
  _d: {} as I18n.Dictionaries
});

// export default I18nTranslateContext;
`,
    },
    I18nTranslateProvider: {
      name: "I18nTranslateProvider",
      ext: "tsx",
      content: () => /* js */ `
"use client";

import React, { useContext } from "react";
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
`,
    },
    useLocale: {
      name: "useLocale",
      ext: "ts",
      index: true,
      content: () => /* js */ `
"use client";

import { useContext } from "react";
import { defaultLocale } from "./defaultLocale";
import { I18nTranslateContext } from "./I18nTranslateContext";

export const useLocale = () => useContext(I18nTranslateContext).locale || defaultLocale;

export default useLocale;
`,
    },
    useT: {
      name: "useT",
      ext: "ts",
      index: true,
      content: () => /* js */ `
"use client";

import { useContext, useMemo } from "react";
import { I18nTranslateContext } from "./I18nTranslateContext";
import type { I18n } from "./types";

export const useT = <T extends I18n.TranslateNamespace>(namespace: T) => {
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

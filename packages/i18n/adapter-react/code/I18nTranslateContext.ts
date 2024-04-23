import type { I18nCompiler } from "../../compiler/types";

export default ({}: I18nCompiler.AdapterArg<"react">) => `
import React from "react";
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

let _I18nTranslateContext;

// For serverComponents (app-dir), the context cannot be used and
// this makes that all the imports to here don't break the build.
// The use of this context is inside each util, depending pages-dir or app-dir.
if (typeof React.createContext === "function") {
  _I18nTranslateContext = React.createContext<I18nTranslateContextValue>({
    t: ((key: string) => key) as I18n.Translate,
    locale: defaultLocale,
    _d: {} as I18n.Dictionaries
  });
}

/**
 * @internal
 */
export const I18nTranslateContext =
  _I18nTranslateContext as React.Context<I18nTranslateContextValue>;

// export default I18nTranslateContext;
`;

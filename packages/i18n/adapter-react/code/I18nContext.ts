import type { I18nCompiler } from "../../compiler/types";

export default ({}: I18nCompiler.AdapterArg<"react">) => `
import React from "react";
import { defaultLocale } from "./defaultLocale";
import type { I18n } from "./types";

export type I18nContextValue = {
  t: I18n.Translate;
  lang: I18n.Locale;
};

let _I18nContext;

// For serverComponents (app-dir), the context cannot be used and
// this makes that all the imports to here don't break the build.
// The use of this context is inside each util, depending pages-dir or app-dir.
if (typeof React.createContext === "function") {
  _I18nContext = React.createContext<I18nContextValue>({
    t: ((key: string) => key) as I18n.Translate,
    lang: defaultLocale,
  });
}

export const I18nContext = _I18nContext as React.Context<I18nContextValue>;

export default I18nContext;
`;

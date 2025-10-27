import { GLOBAL_I18N_IDENTIFIER } from "./compiler/constants";

declare global {
  interface Window extends Record<typeof GLOBAL_I18N_IDENTIFIER, string> {}
}

/**
* Get current locale in browser context
*/
export let i18nGetLocaleInBrowser = (defaultLocale: string = "") =>
 typeof window !== "undefined" ? window[GLOBAL_I18N_IDENTIFIER] : defaultLocale;

export default i18nGetLocaleInBrowser;;

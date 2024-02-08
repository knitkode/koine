import type { I18nCompiler } from "../../compiler";

export default ({ config }: I18nCompiler.AdapterArg) => `
import { locales } from "./locales";
import { defaultLocale } from "./defaultLocale";

/**
 */
export const config = {
  locales,
  defaultLocale,
  hideDefaultLocaleInUrl: ${config.hideDefaultLocaleInUrl},
}

export default config;
`;

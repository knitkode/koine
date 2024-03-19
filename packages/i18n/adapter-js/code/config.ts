import type { I18nCompiler } from "../../compiler/types";

export default ({ config }: I18nCompiler.AdapterArg<"js">) => `
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

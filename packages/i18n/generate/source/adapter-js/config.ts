import type { I18nGenerate } from "../../types";

export default (data: I18nGenerate.Data) => `
import { locales } from "./locales";
import { defaultLocale } from "./defaultLocale";

/**
 */
export const config = {
  locales,
  defaultLocale,
  hideDefaultLocaleInUrl: ${data.hideDefaultLocaleInUrl},
}

export default config;
`;

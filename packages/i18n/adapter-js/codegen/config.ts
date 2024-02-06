import type { I18nCodegen } from "../../codegen";

export default (data: I18nCodegen.Data) => `
import { locales } from "./locales";
import { defaultLocale } from "./defaultLocale";

/**
 */
export const config = {
  locales,
  defaultLocale,
  hideDefaultLocaleInUrl: ${data.config.hideDefaultLocaleInUrl},
}

export default config;
`;

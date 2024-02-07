import type { I18nCodegen } from "../../codegen";

export default ({ config }: I18nCodegen.AdapterArg) => `
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

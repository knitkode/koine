// import type { I18nCompiler } from "../../types";

export default (/* {}: I18nCompiler.AdapterArg */) => `
import { locales } from "./locales";
import type { I18n } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isLocale = (payload: any): payload is I18n.Locale => locales.includes(payload);

export default isLocale;
`;

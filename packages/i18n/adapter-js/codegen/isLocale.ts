// import type { I18nCodegen } from "../../types";

export default (/* {}: I18nCodegen.AdapterArg */) => `
import { locales } from "./locales";
import type { I18n } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isLocale = (payload: any): payload is I18n.Locale => locales.includes(payload);

export default isLocale;
`;

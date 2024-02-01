import { locales } from "./locales";
import type { I18n } from "./types";

export function isLocale(payload: any): payload is I18n.Locale {
  return locales.includes(payload);
}

export default isLocale;

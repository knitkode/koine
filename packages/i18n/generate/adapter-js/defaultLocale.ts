import type { I18nGenerate } from "../types";

export default (data: I18nGenerate.Data) =>
  `
import type { I18n } from "./types";

export const defaultLocale: I18n.Locale = "${data.defaultLocale}";

export default defaultLocale;
`;

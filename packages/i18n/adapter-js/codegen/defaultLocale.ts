import type { I18nCodegen } from "../../codegen";

export default (data: I18nCodegen.Data) =>
  `
import type { I18n } from "./types";

export const defaultLocale: I18n.Locale = "${data.config.defaultLocale}";

export default defaultLocale;
`;

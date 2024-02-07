import type { I18nCodegen } from "../../codegen";

export default ({ config }: I18nCodegen.AdapterArg) =>
  `
import type { I18n } from "./types";

export const defaultLocale: I18n.Locale = "${config.defaultLocale}";

export default defaultLocale;
`;

import type { I18nCompiler } from "../../compiler/types";

export default ({ config }: I18nCompiler.AdapterArg) =>
  `
import type { I18n } from "./types";

export const defaultLocale: I18n.Locale = "${config.defaultLocale}";

export default defaultLocale;
`;

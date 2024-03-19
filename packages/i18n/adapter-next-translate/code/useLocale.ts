import type { I18nCompiler } from "../../compiler/types";

export default ({ config }: I18nCompiler.AdapterArg<"next-translate">) => `
import useTranslation from "next-translate/useTranslation";
import type { I18n } from "./types";

export const useLocale = () => (useTranslation().lang as I18n.Locale) || "${config.defaultLocale}";

export default useLocale;
`;

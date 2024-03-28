import type { I18nCompiler } from "../../compiler/types";

export default ({ config }: I18nCompiler.AdapterArg<"next">) => `
import { useRouter } from "next/router";
import type { I18n } from "./types";

export const useLocale = () => (useRouter().locale as I18n.Locale) || "${config.defaultLocale}";

export default useLocale;
`;

import type { I18nCompiler } from "../../compiler/types";

export default ({}: I18nCompiler.AdapterArg<"next">) => `
import { useRouter } from "next/router";
import { defaultLocale } from "./defaultLocale";
import type { I18n } from "./types";

export const useLocale = () => (useRouter().locale as I18n.Locale) || defaultLocale;

export default useLocale;
`;

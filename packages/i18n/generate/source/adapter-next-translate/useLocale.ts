import type { I18nGenerate } from "../../types";

export default (data: I18nGenerate.Data) => `
import { useRouter } from "next/router";
import type { I18n } from "./types";

export const useLocale = () => (useRouter().locale as I18n.Locale) || "${data.defaultLocale}";
`;

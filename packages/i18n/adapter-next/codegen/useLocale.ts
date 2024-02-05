import type { I18nCodegen } from "../../codegen";

export default (data: I18nCodegen.Data) => `
import { useRouter } from "next/router";
import type { I18n } from "./types";

export const useLocale = () => (useRouter().locale as I18n.Locale) || "${data.defaultLocale}";

export default useLocale;
`;

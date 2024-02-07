import type { I18nCodegen } from "../../codegen";

export default ({ config }: I18nCodegen.AdapterArg) => `
import { useRouter } from "next/router";
import type { I18n } from "./types";

export const useLocale = () => (useRouter().locale as I18n.Locale) || "${config.defaultLocale}";

export default useLocale;
`;

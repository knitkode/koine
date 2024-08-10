import { createGenerator } from "../../compiler/createAdapter";

export default createGenerator("next-translate", (_arg) => {
  return {
    useLocale: {
      name: "useLocale",
      ext: "ts",
      index: true,
      content: () => /* j s */ `
import useTranslation from "next-translate/useTranslation";
import { defaultLocale } from "./defaultLocale";
import type { I18n } from "./types";

export const useLocale = () => (useTranslation().lang as I18n.Locale) || defaultLocale;

export default useLocale;
`,
    },
  };
});

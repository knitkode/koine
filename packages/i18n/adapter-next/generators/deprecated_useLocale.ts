import { createGenerator } from "../../compiler/createAdapter";

export default createGenerator("next", (_arg) => {
  return {
    useLocale: {
      name: "useLocale",
      ext: "ts",
      index: true,
      content: () => /* j s */ `
import { useRouter } from "next/router";
import { defaultLocale } from "./defaultLocale";
import type { I18n } from "./types";

export const useLocale = () => (useRouter().locale as I18n.Locale) || defaultLocale;

export default useLocale;

`,
    },
  };
});

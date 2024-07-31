import { createGenerator } from "../../compiler/createAdapter";

export default createGenerator("js", (_arg) => {
  return {
    isLocale: {
      name: "isLocale",
      ext: "ts",
      index: true,
      content: () => /* js */ `
import { locales } from "./locales";
import type { I18n } from "./types";

export const isLocale = (payload: any): payload is I18n.Locale =>
  locales.includes(payload);

export default isLocale;
`,
    },
  };
});

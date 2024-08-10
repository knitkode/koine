import { createGenerator } from "../../compiler/createAdapter";
import { getI18nDictionaries_inline } from "./getI18nDictionaries_inline";

export default createGenerator("js", (_arg) => {
  return {
    getI18nDictionaries: {
      name: "getI18nDictionaries",
      ext: "ts",
      index: false,
      content: () => /* j s */ `
import { defaultLocale } from "./defaultLocale";
import type { I18n } from "./types";

${getI18nDictionaries_inline(0, true)}
`,
    },
  };
});

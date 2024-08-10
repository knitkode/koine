import { createGenerator } from "../../compiler/createAdapter";
import { loadTranslations_inline } from "./loadTranslations_inline";

export default createGenerator("js", (_arg) => {
  return {
    loadTranslations: {
      name: "loadTranslations",
      ext: "ts",
      index: false,
      content: () => /* j s */ `
import type { I18n } from "./types";

/**
 * @internal
 */
export ${loadTranslations_inline()}
`,
    },
  };
});

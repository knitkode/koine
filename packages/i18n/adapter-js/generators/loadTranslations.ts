import { createGenerator } from "../../compiler/createAdapter";
import { getTranslationsDir } from "../../compiler/helpers";

export default createGenerator("js", (_arg) => {
  return {
    loadTranslations: {
      dir: createGenerator.dirs.internal,
      name: "loadTranslations",
      ext: "ts",
      index: false,
      content: () => /* j s */ `
import type { I18n } from "../types";

/**
 * @internal
 */
export const loadTranslations = (
  locale: I18n.Locale,
  namespace: I18n.TranslateNamespace,
) =>
  import(\`${getTranslationsDir(1)}/\${locale}/\${namespace}.json\`).then(
    (m) => m.default,
  );
`,
    },
  };
});

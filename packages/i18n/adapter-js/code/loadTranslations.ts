import type { I18nCompiler } from "../../compiler/types";

export default ({}: I18nCompiler.AdapterArg<"js">) => `
import type { I18n } from "./types";

/**
 * @internal
 */
export const loadTranslations = (
  locale: I18n.Locale,
  namespace: I18n.TranslateNamespace,
) =>
  import(\`./translations/\${locale}/\${namespace}.json\`).then(
    (m) => m.default,
  );
`;

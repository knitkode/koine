// import type { I18nCompiler } from "../../compiler/types";

export const loadTranslations_inline = () => `const loadTranslations = (
  locale: I18n.Locale,
  namespace: I18n.TranslateNamespace,
) =>
  import(\`./translations/\${locale}/\${namespace}.json\`).then(
    (m) => m.default,
  );
`;

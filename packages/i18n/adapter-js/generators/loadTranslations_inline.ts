import { getTranslationsDir } from "../../compiler/helpers";

export const loadTranslations_inline = (
  folderUp?: number,
) => /* j s */ `const loadTranslations = (
  locale: I18n.Locale,
  namespace: I18n.TranslateNamespace,
) =>
  import(\`${getTranslationsDir(folderUp)}/\${locale}/\${namespace}.json\`).then(
    (m) => m.default,
  );
`;

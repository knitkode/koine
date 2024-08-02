import { getTranslationsDir } from "../../compiler/helpers";

export const loadTranslations_inline = (
  folderUp?: number,
) => /* js */ `const loadTranslations = (
  locale: I18n.Locale,
  namespace: I18n.TranslateNamespace,
) =>
  import(\`${getTranslationsDir(folderUp)}/\${locale}/\${namespace}.json\`).then(
    (m) => m.default,
  );
`;

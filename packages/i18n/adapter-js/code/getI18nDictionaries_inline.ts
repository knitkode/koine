// import type { I18nCompiler } from "../../compiler/types";
import { loadTranslations_inline } from "./loadTranslations_inline";

/**
 * @requires {defaultLocale, I18n}
 */
export const getI18nDictionaries_inline = (exports?: boolean) => `
// import { loadTranslations } from "./loadTranslations";

${loadTranslations_inline()}

type GetI18nDictionariesOptions = {
  locale?: I18n.Locale;
  namespaces?: I18n.TranslateNamespace[];
};

${exports ? "export " : ""}async function getI18nDictionaries({
  locale = defaultLocale,
  namespaces = [],
}: GetI18nDictionariesOptions) {
  const translations =
    (await Promise.all(
      namespaces.map((namespace) => loadTranslations(locale, namespace)
        .catch(() => ({}))
      ),
    )) || [];

  return namespaces.reduce((dictionaries, ns, idx) => {
    dictionaries[ns] =
      translations[idx] ||
      (null as unknown as I18n.TranslationsDictionaryLoose);
    return dictionaries;
  }, {} as I18n.Dictionaries);
}
`;

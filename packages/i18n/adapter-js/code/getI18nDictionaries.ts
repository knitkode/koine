import type { I18nCompiler } from "../../compiler/types";

export default ({}: I18nCompiler.AdapterArg<"js">) => `
import { defaultLocale } from "./defaultLocale";
import { loadTranslations } from "./loadTranslations";
import type { I18n } from "./types";

type GetI18nDictionariesOptions = {
  locale?: I18n.Locale;
  namespaces?: I18n.TranslateNamespace[];
};

export async function getI18nDictionaries({
  locale = defaultLocale,
  namespaces = [],
}: GetI18nDictionariesOptions) {
  const translations =
    (await Promise.all(
      namespaces.map((ns) => loadTranslations(locale, ns).catch(() => ({}))),
    )) || [];

  return namespaces.reduce((dictionaries, ns, idx) => {
    dictionaries[ns] =
      translations[idx] ||
      (null as unknown as I18n.TranslationsDictionaryLoose);
    return dictionaries;
  }, {} as I18n.Dictionaries);
}

export default getI18nDictionaries;
`;

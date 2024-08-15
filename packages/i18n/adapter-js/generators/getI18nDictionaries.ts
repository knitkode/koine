import { createGenerator } from "../../compiler/createAdapter";

export default createGenerator("js", (_arg) => {
  return {
    getI18nDictionaries: {
      dir: createGenerator.dirs.internal,
      name: "getI18nDictionaries",
      ext: "ts",
      index: false,
      content: () => /* j s */ `
import { defaultLocale } from "../defaultLocale";
import type { I18n } from "../types";
import { loadTranslations } from "./loadTranslations";

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
`,
    },
  };
});

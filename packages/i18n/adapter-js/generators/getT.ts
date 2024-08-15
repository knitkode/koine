import { createGenerator } from "../../compiler/createAdapter";

export default createGenerator("js", (_arg) => {
  return {
    getT: {
      name: "getT",
      ext: "ts",
      index: true,
      content: () => /* j s */ `
import { createT } from "./internal/createT";
import { loadTranslations } from "./internal/loadTranslations";
import type { I18n } from "./types";

export async function getT<TNamespace extends I18n.TranslateNamespace>(
  locale: I18n.Locale,
  namespace: TNamespace,
) {
  const translations = await loadTranslations(locale, namespace);
  const pluralRules = new Intl.PluralRules(locale);

  const t = createT({ [namespace]: translations }, pluralRules, locale);
  return ((i18nKey: string, ...args: any[]) =>
    (t as any)(
      \`\${namespace}:\${i18nKey}\`,
      ...args,
    )) as I18n.TranslateNamespaced<TNamespace>;
}

export default getT;
`,
    },
  };
});

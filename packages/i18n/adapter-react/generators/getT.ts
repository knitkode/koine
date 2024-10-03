import { createGenerator } from "../../compiler/createAdapter";

export default createGenerator("react", (_arg) => {
  return {
    getT: {
      dir: createGenerator.dirs.server,
      name: "getT",
      ext: "ts",
      index: true,
      content: () => /* j s */ `
import { loadTranslations } from "../internal/loadTranslations";
import { createT } from "../createT";
import type { I18n } from "../types";
import { getLocale } from "./getLocale";

/**
 * **For React RSC only**
 * 
 * It grabs the current locale from NodeJS' \`AsyncLocalStorage\` implementation
 * used in \`I18nLocaleContext\`.
 * 
 * For compatibility with the vanilla _js_ implementation of this function and
 * for further customization it allows passing as first argument a custom _locale_
 * code.
 */
export async function getT<TNamespace extends I18n.TranslateNamespace>(
  namespace: TNamespace,
): Promise<I18n.TranslateNamespaced<TNamespace>>;
export async function getT<TNamespace extends I18n.TranslateNamespace>(
  locale: I18n.Locale,
  namespace: TNamespace,
): Promise<I18n.TranslateNamespaced<TNamespace>>;
export async function getT<TNamespace extends I18n.TranslateNamespace>(
  ...args: [TNamespace | I18n.Locale] | [TNamespace | I18n.Locale, TNamespace]
  // localeOrNamespace: TNamespace | I18n.Locale,
  // _namespace?: TNamespace,
) {
  const locale = args.length === 1 ? getLocale() : (args[0] as I18n.Locale);
  const namespace = args[1] || (args[0] as TNamespace);
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

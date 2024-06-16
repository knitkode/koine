import { loadTranslations_inline } from "../../adapter-js/code/loadTranslations_inline";
import type { I18nCompiler } from "../../compiler/types";

export default ({}: I18nCompiler.AdapterArg<"react">) => `
import { createT } from "./createT";
import { getLocale } from "./getLocale";
// import { loadTranslations } from "./loadTranslations";
import type { I18n } from "./types";

${loadTranslations_inline()}

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ((i18nKey: string, ...args: any[]) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (t as any)(
      \`\${namespace}:\${i18nKey}\`,
      ...args,
    )) as I18n.TranslateNamespaced<TNamespace>;
}

export default getT;
`;
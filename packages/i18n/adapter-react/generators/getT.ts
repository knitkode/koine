import { createGenerator } from "../../compiler/createAdapter";

export default createGenerator("react", (arg) => {
  return {
    getT: {
      dir: createGenerator.dirs.server,
      name: "getT",
      ext: "ts",
      index: true,
      content: () => /* j s */ `
import { i18nConsole } from "@koine/i18n";
import { loadTranslations } from "../internal/loadTranslations";
import { createT } from "../createT";
import type { I18n } from "../types";
import { getLocale } from "./getLocale";

/**
 * **For React Server Components only**
 * 
 * For compatibility with the vanilla _js_ implementation of this function and
 * for further customization it allows passing as first argument a custom _locale_
 * code.
 */
export async function getT<TNamespace extends I18n.TranslationsNamespace>(
  namespace: TNamespace,
): Promise<I18n.TranslateNamespaced<TNamespace>>;
export async function getT<TNamespace extends I18n.TranslationsNamespace>(
  locale: I18n.Locale,
  namespace: TNamespace,
): Promise<I18n.TranslateNamespaced<TNamespace>>;
export async function getT<TNamespace extends I18n.TranslationsNamespace>(
  ...args: [TNamespace | I18n.Locale] | [TNamespace | I18n.Locale, TNamespace]
  // localeOrNamespace: TNamespace | I18n.Locale,
  // _namespace?: TNamespace,
) {
  const locale = args.length === 1 ? getLocale() : (args[0] as I18n.Locale);
  const namespace = args[1] || (args[0] as TNamespace);${createGenerator.log(arg, "getT", "", "{ locale, namespace }")}
  const translations = await loadTranslations(locale, namespace);
  const t = createT({ [namespace]: translations }, locale);

  return ((path: string, ...args: any[]) =>
    (t as any)(
      \`\${namespace}:\${path}\`,
      ...args,
    )) as I18n.TranslateNamespaced<TNamespace>;
}

export default getT;
`,
    },
  };
});

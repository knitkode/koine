import type { I18nCompiler } from "../../compiler/types";
import { loadTranslations_inline } from "./loadTranslations_inline";

export default ({}: I18nCompiler.AdapterArg<"js">) => `
import { createT } from "./createT";
// import { loadTranslations } from "./loadTranslations";
import type { I18n } from "./types";

${loadTranslations_inline()}

export async function getT<TNamespace extends I18n.TranslateNamespace>(
  locale: I18n.Locale,
  namespace: TNamespace,
) {
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

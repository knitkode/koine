import { createGenerator } from "../../compiler/createAdapter";

export default createGenerator("js", (arg) => {
  const {
    config: { single },
    options: {
      translations: {
        fallbackDefaultStrategy,
        tokens: { keyDelimiter, namespaceDelimiter },
      },
    },
  } = arg;

  return {
    createT: {
      dir: "",
      name: "createT",
      ext: "ts",
      index: true,
      content: () => /* j s */ `
import { type I18nUtils, i18nInterpolateParamsDeep } from "@koine/i18n";
import type { I18n } from "./types";${
        single
          ? ""
          : `
import { defaultLocale } from "./defaultLocale";`
      }

/**
 * Create \`t\` function based on given dictionary/dictionaries and given locale
 */
export function createT<TDictionary extends I18nUtils.TranslationsDictionaryLoose>(
  dictionaries: TDictionary,
  ${single ? "locale: I18n.Locale = defaultLocale" : "locale: I18n.Locale"},
  pluralRules?: Intl.PluralRules,
) {
  pluralRules = pluralRules || new Intl.PluralRules(locale);
  return <
    TTrace extends I18nUtils.Paths<TDictionary>,
    TFallback extends I18nUtils.Get<TDictionary, TTrace>,
    TReturn = I18nUtils.Get<TDictionary, TTrace>,
  >(
    trace: TTrace,
    query?: I18nUtils.TranslateQuery,
    fallback?: TFallback
  ): TReturn => {
    const [namespaceOrPath, maybePath] = trace.split("${namespaceDelimiter}");
    // namespace is optional, so in case there is no delimiter we just have the path
    const namespace = namespaceOrPath && maybePath ? namespaceOrPath : "";
    const path = namespaceOrPath && maybePath ? maybePath : namespaceOrPath;
    const dic = (namespace && dictionaries[namespace]) || dictionaries || {};
    const pluralisedKey = getPluralisedKey(pluralRules, dic, path, query);
    const value = getValue(dic, pluralisedKey);
      
    // check if value is empty
    if (
      typeof value === "undefined" ||
      value === null ||
      value === "" ||
      (typeof value === "object" && !Object.keys(value).length) ||
      (Array.isArray(value) && !value.length)
    ) {
      // special case when query is an empty string use it as fallback
      fallback = query === "" ? query : fallback;
      return (typeof fallback !== "undefined" ? fallback : ${fallbackDefaultStrategy === "key" ? `trace` : `value || ""`}) as TReturn;
    }

    return (query ? i18nInterpolateParamsDeep(value, query) : value) as TReturn;
  };
}

/**
 * Get value from key (allow nested keys as parent.children)
 */
function getValue(
  dic: I18nUtils.TranslationsDictionaryLoose,
  key: string = "",
): unknown | undefined {
  const keyParts = key.split("${keyDelimiter}");

  return keyParts.reduce(
    (val: I18nUtils.TranslationsDictionaryLoose | string, key: string) => {
      return val?.[key as keyof typeof val] ?? {};
    },
    dic,
  );
}

/**
 * Control plural keys depending the {{count}} variable
 */
function getPluralisedKey(
  pluralRules: Intl.PluralRules,
  dic: I18nUtils.TranslationsDictionaryLoose,
  key: string,
  query?: I18nUtils.TranslateQuery
): string {
  const count = query instanceof Object ? query["count"] : null;

  if (!query || typeof count !== "number") return key;

  if (getValue(dic, key + "_" + count) !== undefined) {
    return key + "_" + count;
  }

  const pluralKey = key + "_" + pluralRules.select(count);
  if (getValue(dic, pluralKey) !== undefined) {
    return pluralKey;
  }

  if (getValue(dic, key + "${keyDelimiter}" + count) !== undefined) {
    return key + "${keyDelimiter}" + count;
  }

  const nestedKey = key + "${keyDelimiter}" + pluralRules.select(count);
  if (getValue(dic, nestedKey) !== undefined) {
    return nestedKey;
  }

  return key;
}

export default createT;
`,
    },
  };
});

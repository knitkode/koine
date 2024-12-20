/* eslint-disable */
// @ts-nocheck
import { type I18nUtils, i18nInterpolateParamsDeep } from "@koine/i18n";
import type { I18n } from "./types";
import { defaultLocale } from "./defaultLocale";

/**
 * Create `t` function based on given dictionary/dictionaries and given locale
 */
export function createT<TDictionary extends I18nUtils.TranslationsDictionaryLoose>(
  dictionaries: TDictionary,
  locale: I18n.Locale,
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
    const [namespaceOrPath, maybePath] = trace.split(":");
    // namespace is optional, so in case there is no delimiter we just have the path
    const namespace = namespaceOrPath && maybePath ? namespaceOrPath : "";
    const path = namespaceOrPath && maybePath ? maybePath : namespaceOrPath;
    const dic = (namespace && dictionaries[namespace]) || dictionaries || {};
    const [value, isEmpty] = getValue(pluralRules, dic, path, query);
      
    if (isEmpty) {
      // special case when query is an empty string use it as fallback
      fallback = query === "" ? query : fallback;
      return (typeof fallback !== "undefined" ? fallback : trace) as TReturn;
    }

    return (query ? i18nInterpolateParamsDeep(value, query) : value) as TReturn;
  };
}

function getValue(
  pluralRules: Intl.PluralRules,
  dictionary: I18nUtils.TranslationsDictionaryLoose,
  path: string,
  query?: I18nUtils.TranslateQuery
): [unknown | undefined, boolean] {
  const count = query instanceof Object ? query["count"] : null;

  if (typeof count === "number") {
    const countRule = pluralRules.select(count);
    const pluralisedPaths = [
      path + "_" + count,
      path + "_" + countRule,
      path + "." + count,
      path + "." + countRule,
    ];
  
    for (let i = 0; i < pluralisedPaths.length; i++) {
      const pluralisedPath = pluralisedPaths[i];
    
      const output = getValueAtPath(dictionary, pluralisedPath);
      if (output[0] !== undefined) {
        return output;
      }
    }
  }

  return getValueAtPath(dictionary, path);
}

/**
 * Get value at path (allow nested keys as parent.children)
 */
function getValueAtPath(
  dictionary: I18nUtils.TranslationsDictionaryLoose,
  path: string = "",
): unknown | undefined {
  const keys = path.split(".");

  const value = keys.reduce(
    (val: I18nUtils.TranslationsDictionaryLoose | string, key: string) => {
      return val?.[key as keyof typeof val];
    },
    dictionary,
  );

  // check if value is empty
  const isEmpty = (
    typeof value === "undefined" ||
    value === null ||
    value === "" ||
    (typeof value === "object" && !Object.keys(value).length) ||
    (Array.isArray(value) && !value.length)
  );

  return [value, isEmpty];
}

export default createT;

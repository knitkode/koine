import { createGenerator } from "../../compiler/createAdapter";

// TODO: reuse here tInterpolateParamsDeep and tPluralise
export default createGenerator("js", (arg) => {
  const {
    config: { single },
    options: {
      translations: {
        fallbackDefaultStrategy,
        tokens: {
          keyDelimiter,
          namespaceDelimiter
        }
      }
    },
  } = arg;

  return {
    createT: {
      dir: "",
      name: "createT",
      ext: "ts",
      index: true,
      content: () => /* j s */ `
import type { I18nUtils } from "${process.env["JEST_WORKER_ID"] ? "../../../types" : "@koine/i18n"}";
import type { I18n } from "./types";${
        single
          ? ""
          : `
import { defaultLocale } from "./defaultLocale";`
      }
import { tInterpolateParamsDeep } from "./internal/tInterpolateParamsDeep";

// An optional parameter allowEmptyStrings - true as default.
// If allowEmptyStrings parameter is marked as false,
// it should log an error when an empty string is attempted to be translated
// and return the namespace and key as result of the translation.
const allowEmptyStrings = true;

/**
 * Create \`t\` function based on given dictionary/dictionaries and given locale
 */
export function createT<TDictionary extends I18n.TranslationsDictionaryLoose>(
  dictionaries: TDictionary,
  ${single ? "locale: I18n.Locale = defaultLocale" : "locale: I18n.Locale"},
  pluralRules?: Intl.PluralRules,
) {
  pluralRules = pluralRules || new Intl.PluralRules(locale);
  return <
    TPath extends I18nUtils.Paths<TDictionary>,
    TFallback extends I18nUtils.Get<TDictionary, TPath>,
    TReturn = I18nUtils.Get<TDictionary, TPath>,
  >(
    fullpath: TPath,
    query?: I18n.TranslationQuery,
    fallback?: TFallback
  ): TReturn => {
    let [namespaceOrPath, maybePath] = fullpath.split("${namespaceDelimiter}");
    // namespace is optional, so in case there is no delimiter we just have the path
    const namespace = namespaceOrPath && maybePath ? namespaceOrPath : "";
    const path = namespaceOrPath && maybePath ? maybePath : namespaceOrPath;
    const dic = (namespace && dictionaries[namespace]) || dictionaries || {};
    const pluralisedKey = getPluralisedKey(pluralRules, dic, path, query);
    const value = getDicValue(dic, pluralisedKey);
      
    // check if value is empty
    if (
      typeof value === "undefined" ||
      value === null ||
      value === "" ||
      (typeof value === "object" && !Object.keys(value).length) ||
      (Array.isArray(value) && !value.length)
    ) {
      return typeof fallback !== "undefined"
        ? fallback
        : ${fallbackDefaultStrategy === "key" ? `fullpath` : `""`} as TReturn;
    }

    return (query ? tInterpolateParamsDeep(value, query) : value) as TReturn;
  };
}

/**
 * Get value from key (allow nested keys as parent.children)
 */
function getDicValue(
  dic: I18n.TranslationsDictionaryLoose,
  key: string = "",
): unknown | undefined {
  const keyDelimiter = "${keyDelimiter}";
  const keyParts = keyDelimiter ? key.split(keyDelimiter) : [key];

  return keyParts.reduce(
    (val: I18n.TranslationsDictionaryLoose | string, key: string) => {
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
  dic: I18n.TranslationsDictionaryLoose,
  key: string,
  query?: I18n.TranslationQuery
): string {
  const count = query instanceof Object ? query["count"] : null;

  if (!query || typeof count !== "number") return key;

  if (getDicValue(dic, key + "_" + count) !== undefined) {
    return key + "_" + count;
  }

  const pluralKey = key + "_" + pluralRules.select(count);
  if (getDicValue(dic, pluralKey) !== undefined) {
    return pluralKey;
  }

  if (getDicValue(dic, key + "${keyDelimiter}" + count) !== undefined) {
    return key + "." + count;
  }

  const nestedKey = key + "${keyDelimiter}" + pluralRules.select(count);
  if (getDicValue(dic, nestedKey) !== undefined) {
    return nestedKey;
  }

  return key;
}

export default createT;
`,
    },
  };
});

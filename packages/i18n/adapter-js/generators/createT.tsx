import { createGenerator } from "../../compiler/createAdapter";

export default createGenerator("js", (arg) => {
  const { options } = arg;

  return {
    createT: {
      name: "createT",
      ext: "ts",
      index: true,
      content: () => /* j s */ `
import type { I18n } from "./types";
import { defaultLocale } from "./defaultLocale";
import { tInterpolateParams } from "./tInterpolateParams";

// An optional parameter allowEmptyStrings - true as default.
// If allowEmptyStrings parameter is marked as false,
// it should log an error when an empty string is attempted to be translated
// and return the namespace and key as result of the translation.
const allowEmptyStrings = true;

/**
 * @see https://github.com/aralroca/next-translate/blob/master/src/transCore.tsx
 */
export function createT(
  dictionaries: I18n.Dictionaries,
  pluralRules: Intl.PluralRules,
  locale: string = defaultLocale,
) {
  const interpolateUnknown = (
    value: unknown,
    query?: I18n.TranslationQuery | null,
  ): typeof value => {
    if (Array.isArray(value)) {
      return value.map((val) => interpolateUnknown(val, query));
    }
    if (value instanceof Object) {
      return objectInterpolation(
        value as Record<string, unknown>,
        query,
        locale,
      );
    }
    return interpolation(value as string, query, locale);
  };

  return <
    TPath extends I18n.TranslationsAllPaths,
    TReturn = I18n.TranslationAtPath<TPath>,
  >(
    path: TPath,
    query?: I18n.TranslationQuery,
    options?: I18n.TranslationOptions,
  ): TReturn => {
    const [namespace, key] = path.split("${options.translations.tokens.namespaceDelimiter}");
    const dic = (namespace && dictionaries[namespace]) || {};
    const pluralisedKey = getPluralisedKey(pluralRules, dic, key, query, options);
    const dicValue = getDicValue(dic, pluralisedKey, query, options);
    const value =
      typeof dicValue === "object"
        ? JSON.parse(JSON.stringify(dicValue))
        : dicValue;

    const empty =
      typeof value === "undefined" ||
      (typeof value === "object" && !Object.keys(value).length) ||
      (Array.isArray(value) && !value.length) ||
      (value === "" && !allowEmptyStrings);

    // no need to try interpolation
    if (empty) {
      return (query === "" ? "" : path) as unknown as TReturn;
    }

    // this can return an empty string if either value was already empty
    // or it contained only an interpolation (e.g. "{{name}}") and the query param was empty
    return interpolateUnknown(value, query) as TReturn;
  };
}

// const Empty = new Symbol("Empty tranlsation message")

/**
 * Get value from key (allow nested keys as parent.children)
 */
function getDicValue(
  dic: I18n.TranslationsDictionaryLoose,
  key: string = "",
  query?: I18n.TranslationQuery,
  options?: I18n.TranslationOptions,
): unknown | undefined {
  const keySeparator = ".";
  const keyParts = keySeparator ? key.split(keySeparator) : [key];
  const returnObjects =
    query === "obj" ||
    options === "obj" ||
    (options instanceof Object && options.returnObjects);

  if (key === keySeparator && returnObjects) return dic;

  const value: string | object = keyParts.reduce(
    (val: I18n.TranslationsDictionaryLoose | string, key: string) => {
      if (typeof val === "string") {
        return {};
      }

      const res = val[key as keyof typeof val];

      // pass all truthy values or (empty) strings
      return res || (typeof res === "string" ? res : {});
    },
    dic,
  );

  if (
    typeof value === "string" ||
    (returnObjects && Object.keys(value).length > 0)
  ) {
    return value;
  }

  if (Array.isArray(value) && returnObjects) return value;
  return undefined;
}

/**
 * Control plural keys depending the {{count}} variable
 */
function getPluralisedKey(
  pluralRules: Intl.PluralRules,
  dic: I18n.TranslationsDictionaryLoose,
  key: string,
  query?: I18n.TranslationQuery | null,
  options?: I18n.TranslationOptions,
): string {
  const count = query instanceof Object ? query["count"] : null;

  if (!query || typeof count !== "number") return key;

  const numKey = \`\${key}_\${count}\`;
  if (getDicValue(dic, numKey, query, options) !== undefined) return numKey;

  const pluralKey = \`\${key}_\${pluralRules.select(count)}\`;
  if (getDicValue(dic, pluralKey, query, options) !== undefined) {
    return pluralKey;
  }

  const nestedNumKey = \`\${key}.\${count}\`;
  if (getDicValue(dic, nestedNumKey, query, options) !== undefined)
    return nestedNumKey;

  const nestedKey = \`\${key}.\${pluralRules.select(count)}\`;
  if (getDicValue(dic, nestedKey, query, options) !== undefined)
    return nestedKey;

  return key;
}

/**
 * Replace {{variables}} to query values
 */
function interpolation(
  text?: string,
  query?: I18n.TranslationQuery | null,
  _locale?: string | undefined,
): string {
  if (!text || !query || query === "obj") return text || "";

  return tInterpolateParams(text, query);
}

function objectInterpolation(
  obj: Record<string, string | unknown>,
  query?: I18n.TranslationQuery | null,
  locale?: string,
) {
  if (!query || Object.keys(query).length === 0) return obj;
  Object.keys(obj).forEach((key) => {
    if (obj[key] instanceof Object)
      objectInterpolation(
        obj[key] as Record<string, string | unknown>,
        query,
        locale,
      );
    if (typeof obj[key] === "string")
      obj[key] = interpolation(obj[key] as string, query, locale);
  });

  return obj;
}
`,
    },
  };
});

import {
  forin,
  isNumericLiteral,
  objectPick,
  split,
  splitReverse,
} from "@koine/utils";
import type { I18nCompiler } from "./types";

export type PluralKey = `${string}_${PluralSuffix}`;

export type PluralSuffix = `${number}` | PluralSuffixNamed;

export type PluralSuffixNamed = (typeof pluralSuffixes)[number];

/**
 * @see https://github.com/aralroca/next-translate?tab=readme-ov-file#5-plurals
 */
const pluralSuffixes = ["zero", "one", "two", "few", "many", "other"] as const;

const requiredPluralSuffix: PluralSuffixNamed = "other";

/**
 * Is the given string a valid plural suffix?
 */
export let isPluralSuffix = (suffix: string): suffix is PluralSuffix =>
  pluralSuffixes.includes(suffix as PluralSuffixNamed) ||
  isNumericLiteral(suffix);

/**
 * Remove plural suffix from string
 */
export let removePluralSuffix = (key: PluralKey) => {
  const [suffix] = splitReverse(key as PluralKey, "_");
  return suffix ? key.replace(`_${suffix}`, "") : key;
};

/**
 * Get plural suffix from string
 */
export let getPluralSuffix = (key: PluralKey) =>
  splitReverse(key as PluralKey, "_")[0];

/**
 * Is the translation value object key a plural form?
 *
 * Using `splitReverse` ensures to get the last underscore prefixed suffix
 * even in a string with multiple underscores.
 */
export let isPluralKey = (key: string): key is PluralKey => {
  const [suffix] = splitReverse(key as PluralKey, "_");
  return isPluralSuffix(suffix);
};

const groupPluralsKeysByRoot = (pluralKeys: PluralKey[]) => {
  const map: Record<string, PluralKey[]> = {};

  pluralKeys.forEach((key) => {
    const [root] = split(key, "_");

    map[root] = map[root] || [];
    map[root].push(key);
  });

  return map;
};

/**
 * Some translations keys won't be used directly and should be omitted
 * from the generated types, e.g. the plural versions of the same string.
 */
export let transformKeysForPlurals = (keys: string[]) => {
  if (keys.includes(requiredPluralSuffix)) {
    const pluralKeys = keys.filter(isPluralKey);

    if (pluralKeys.length) {
      let transformedKeys: string[] = [...keys];
      const groupedPlurals = groupPluralsKeysByRoot(pluralKeys);

      forin(groupedPlurals, (pluralRoot, pluralKeys) => {
        // add the plural root
        if (!keys.includes(pluralRoot)) {
          transformedKeys.push(pluralRoot);
        }
        // remove the plurals variations
        pluralKeys.forEach((pluralKey) => {
          if (keys.includes(pluralKey)) {
            transformedKeys = transformedKeys.filter((k) => k !== pluralKey);
          }
        });
      });
      return transformedKeys;
    }
  }

  return keys;
};

/**
 * Does the translation value object has plurals version?
 *
 * NB: here we check only for the **required** plural suffix,
 */
export let hasPlurals = (value: {
  [key: string]: I18nCompiler.DataTranslationValue;
}) =>
  // Object.keys(value).some(isPluralKey);
  Object.keys(value).includes(requiredPluralSuffix);

/**
 * Is the translation value object only enumerating plurals version?
 */
export let hasOnlyPluralKeys = (value: {
  [key: string]: I18nCompiler.DataTranslationValue;
}): value is { [key: string]: string } =>
  hasPlurals(value) ? pickNonPluralKeys(value).length === 0 : false;

/**
 * Pick the translation value object keys that _have no_ to do with pluralisation
 */
export let pickNonPluralKeys = (value: {
  [key: string]: I18nCompiler.DataTranslationValue;
}) =>
  Object.keys(value).filter(
    (k) => !isPluralSuffix(k),
  ) as (keyof typeof value)[];

/**
 * Narrows the translation value object picking only keys that _have no_ to do
 * with pluralisation
 */
export let pickNonPluralValue = (value: {
  [key: string]: I18nCompiler.DataTranslationValue;
}) => (hasPlurals(value) ? objectPick(value, pickNonPluralKeys(value)) : value);

/**
 * @deprecated
 */
export let analyseObjectPlurals = (obj: {
  [key: string]: I18nCompiler.DataTranslationValue;
}) => {
  const keys = Object.keys(obj);
  const hasPlurals = keys.includes(requiredPluralSuffix);
  let hasOnlyPluralKeys = false;
  let newValue = obj;

  if (hasPlurals) {
    const nonPluralKeys = keys.filter((k) => !isPluralSuffix(k));
    hasOnlyPluralKeys = nonPluralKeys.length === 0;
    newValue = objectPick(obj, nonPluralKeys as (keyof typeof obj)[]);
  }

  return {
    hasPlurals,
    hasOnlyPluralKeys,
    newValue,
  };
};

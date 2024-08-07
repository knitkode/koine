import { basename, dirname, extname, join, sep } from "node:path";
import {
  forin,
  isArray,
  isObject,
  isPrimitive,
  isString,
  objectSort,
} from "@koine/utils";
import { filterInputTranslationFiles } from "../helpers";
import {
  type PluralKey,
  type PluralSuffix,
  getPluralSuffix,
  isPluralKey,
  removePluralSuffix,
} from "../pluralisation";
import type { I18nCompiler } from "../types";

export const codeDataTranslationsOptions = {
  /**
   * A list of globs to run against source files, those that are matched will be
   * ignored
   *
   * @see https://www.npmjs.com/package/minimatch
   */
  ignorePaths: [] as string[],
  /**
   * Given a translation value as `"myKey": ["two", "words"]`:
   * - when `true`: it outputs `t_myKey_0`  and `t_myKey_1` functions
   * - when `false`: if `fnsAsDataCodes` is `true` it outputs `t_myKey` otherwise
   * it outputs nothing (TODO: maybe we could log this info in this case)
   *
   * NB: It is quite unlikely that you want to set this to `true`.
   *
   * @default false
   */
  createArrayIndexBasedFns: false,
  // TODO: add pluralisation config
  /**
   * It creates `t_` functions that returns objects and arrays to use as
   * data source.
   *
   * NB: this greatly increased the generated code, tree shaking will still
   * apply though.
   *
   * @default true
   */
  fnsAsDataCodes: true,
  /**
   * Generated `namespace_tKey()` functions prefix, prepended to the automatically
   * generated function names.
   *
   * @default ""
   */
  fnsPrefix: "",
  tokens: {
    /** @default ":" */
    namespaceDelimiter: ":",
    dynamicDelimiters: {
      /** @default "{{" */
      start: "{{",
      /** @default "}}" */
      end: "}}",
    },
  },
};

export type CodeDataTranslationsOptions = typeof codeDataTranslationsOptions;

const slashRegex = new RegExp(sep, "g");

/**
 * Normalise translation key
 */
const normaliseTranslationKey = (key: string) => {
  const replaced = key
    // replace tilde with dollar
    .replace(/~/g, "$")
    // replace dash with underscore
    .replace(/-/g, "_")
    .replace(slashRegex, "_")
    // collapse consecutive underscores
    .replace(/_+/g, "_")
    // ensure valid js identifier, allow only alphanumeric characters and few symbols
    .replace(/[^a-zA-Z0-9_$]/gi, "");

  // ensure the key does not start with a number (invalid js)
  return /^[0-9]/.test(replaced) ? "$" + replaced : replaced;
};

const extractTranslationParamsFromPrimitive = (
  options: CodeDataTranslationsOptions,
  value: Extract<I18nCompiler.DataTranslationValue, string | number | boolean>,
) => {
  if (isString(value)) {
    const { start, end } = options.tokens.dynamicDelimiters;
    const regex = new RegExp(`${start}(.*?)${end}`, "gm");
    const matches = value.match(regex);
    if (matches) {
      return matches
        .map((match) => match.replace(start, "").replace(end, "").trim())
        .reduce((map, paramName) => {
          // TODO: maybe determine the more specific type with some kind of special
          // token used in the route id `[dynamicParam]` portion
          map[paramName] = "stringOrNumber";
          return map;
        }, {} as I18nCompiler.DataParams);
    }
  }
  return;
};

/**
 * This was an experiment to extract params to interpolate from non-flat
 * translations values, but that does not seem really needed as one
 * can always use `tInterpolateParams` directly on whatever string
 *
 * @deprecated
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const extractTranslationParamsFromValue = (
  options: CodeDataTranslationsOptions,
  value: I18nCompiler.DataTranslationValue,
  params: I18nCompiler.DataParams = {},
) => {
  if (isPrimitive(value)) {
    const extracted = extractTranslationParamsFromPrimitive(options, value);
    if (extracted) params = { ...params, ...extracted };

    return params;
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const extracted = extractTranslationParamsFromPrimitive(
        options,
        value[i],
      );
      if (extracted) params = { ...params, ...extracted };
    }
  } else {
    for (const key in value) {
      const extracted = extractTranslationParamsFromValue(
        options,
        value[key],
        params,
      );
      if (extracted) params = { ...params, ...extracted };
    }
  }
  return {};
};

// const addDataTranslationEntryForObjectValue = (
//   options: CodeDataTranslationsOptions,
//   id: string,
//   locale: I18nCompiler.Locale,
//   value: Exclude<Extract<I18nCompiler.DataTranslationValue, object>, string[]>,
//   dataTranslations: I18nCompiler.DataTranslations,
// ) => {
//   // if (hasOnlyPluralKeys(value)) {
//   //   return `'${key}': string;`;
//   // }
//   // if (!isArray(value) && isObject(value)) {
//   //   if (hasOnlyPluralKeys(value)) {
//   //     return `'${key}': string;`;
//   //   }
//   //   if (hasPlurals(value)) {
//   //     return `'${key}': string | ${buildTypeForValue(pickNonPluralValue(value))}`;
//   //   }
//   // }
//   // return `'${key}': ${buildTypeForValue(value)}`;
// };

/**
 * At this point the data translations have been calculated, this happens in a
 * second pass as we need to know all the translations keys to look for plural
 * variations.
 *
 * NB: we mutate the `dataTranslations`
 */
const manageDataTranslationsPlurals = (
  options: CodeDataTranslationsOptions,
  dataTranslations: I18nCompiler.DataTranslations,
) => {
  const pluralTranslationIds =
    Object.keys(dataTranslations).filter<PluralKey>(isPluralKey);

  pluralTranslationIds.forEach((translationIdPluralised) => {
    const id = removePluralSuffix(translationIdPluralised);
    const pluralSuffix = getPluralSuffix(translationIdPluralised);

    // we need to create it if we only have `x_one` `x_other` but not `x`
    dataTranslations[id] = dataTranslations[id] || {};

    // we only need to rearrange plurals defined as `x_one`, `x_other`, if plurals
    // are instead defined as objects `{ one: "", other: "" }` we just keep that
    // object structure for `values`
    if (dataTranslations[translationIdPluralised]) {
      const values = dataTranslations[id].values || {};

      forin(
        dataTranslations[translationIdPluralised].values,
        (locale, value) => {
          // we need to ensure the value is an object for pluralisation, so if
          // we encounter this structure:
          // { "plural": "Plural", "plural_one": "One", "plural_other": "Some" }
          // we just remove the first `plural` value as that key is instead used
          // to grab the right pluralised version from the object value we build
          // from the other plural-suffixed keys. TODO: maybe we could warn the
          // developer of improper usage of `plural` translation key, which is
          // simply useless
          // prettier-ignore
          values[locale] = isObject(values[locale]) ? values[locale] : {};
          // prettier-ignore
          (values[locale] as Record<PluralSuffix, I18nCompiler.DataTranslationValue>)[pluralSuffix] = value;

          const params = extractTranslationParamsFromValue(options, value);
          if (params) {
            dataTranslations[id].params = {
              ...(dataTranslations[id].params || {}),
              ...params,
            };
          }
        },
      );

      if (Object.keys(values).length) {
        dataTranslations[id].values = values;
        dataTranslations[id].plural = true;
      }

      // TODO: probaly here we should remove the non-plural keys from `values`
      // as they are anyway accessible from "deeper" functions e.g.
      // `withPluralAndOtherKeys({ count: 3 }) => "One" | "Many"`
      // `withPluralAndOtherKeys_nonPluralKey()` => "Yes"

      // delete ids that we re-arranged in the plural-ready object value
      delete dataTranslations[translationIdPluralised];
    }
  });

  return dataTranslations;
};

/**
 * Add entry to translations data
 */
const addDataTranslationEntry = (
  options: CodeDataTranslationsOptions,
  id: string,
  locale: I18nCompiler.Locale,
  value: I18nCompiler.DataTranslationValue,
  dataTranslations: I18nCompiler.DataTranslations,
) => {
  if (isPrimitive(value)) {
    dataTranslations[id] = dataTranslations[id] || {};
    dataTranslations[id].values = dataTranslations[id].values || {};
    dataTranslations[id].values[locale] = value;
    dataTranslations[id].typeValue = "Primitive";
    const params = extractTranslationParamsFromPrimitive(options, value);
    if (params) dataTranslations[id].params = params;
  } else {
    if (options.fnsAsDataCodes) {
      const typeValue = isArray(value) ? "Array" : "Object";
      dataTranslations[id] = dataTranslations[id] || {};
      dataTranslations[id].values = dataTranslations[id].values || {};
      dataTranslations[id].values[locale] = value;
      dataTranslations[id].typeValue = typeValue;
      // @see comment on `extractTranslationParamsFromValue`
      // const params = extractTranslationParamsFromValue(options, value);
      // if (params) dataTranslations[id].params = params;
    }

    if (isArray(value)) {
      if (options.createArrayIndexBasedFns) {
        for (let i = 0; i < value.length; i++) {
          addDataTranslationEntry(
            options,
            id + "_" + i,
            locale,
            value[i],
            dataTranslations,
          );
        }
      }
    } else {
      for (const tKey in value) {
        addDataTranslationEntry(
          options,
          id + "_" + normaliseTranslationKey(tKey),
          locale,
          value[tKey],
          dataTranslations,
        );
      }
    }
  }

  return dataTranslations;
};

/**
 * Get translation data recursively starting from a specific file
 */
const getCodeDataTranslationsFromFile = (
  options: CodeDataTranslationsOptions,
  file: I18nCompiler.DataInputTranslationFile,
  dataTranslations: I18nCompiler.DataTranslations,
): I18nCompiler.DataTranslations => {
  const { locale, path } = file;
  const filename = join(dirname(path), basename(path, extname(path)));

  for (const tKey in file.data) {
    const tValue = file.data[tKey];
    const id = normaliseTranslationKey(filename + (tKey ? "_" + tKey : ""));
    addDataTranslationEntry(options, id, locale, tValue, dataTranslations);
  }

  return dataTranslations;
};

/**
 * Get translations data
 */
export let getCodeDataTranslations = (
  _config: I18nCompiler.Config,
  options: CodeDataTranslationsOptions,
  { translationFiles }: I18nCompiler.DataInput,
) => {
  const { ignorePaths } = options;
  let dataTranslations: I18nCompiler.DataTranslations = {};

  filterInputTranslationFiles(translationFiles, ignorePaths).forEach((file) =>
    getCodeDataTranslationsFromFile(options, file, dataTranslations),
  );

  dataTranslations = manageDataTranslationsPlurals(options, dataTranslations);

  // sort
  dataTranslations = objectSort(dataTranslations);

  // console.log("generateTypes: outputDir", outputDir, "outputPath", outputPath);
  return dataTranslations;
};

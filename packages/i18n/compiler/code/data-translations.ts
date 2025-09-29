import { basename, dirname, extname, join } from "node:path";
import {
  areEqual,
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
  getRequiredPluralSuffix,
  hasOnlyPluralKeys,
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
   *
   * @default []
   */
  ignorePaths: [] as string[],
  /**
   * Given a translation value as `"myKey": ["two", "words"]`:
   * - when `true`: it outputs `t_myKey_0`  and `t_myKey_1` functions
   * - when `false`: if `functions.asData` is `true` it outputs `t_myKey` otherwise
   * it outputs nothing (TODO: maybe we could log this info in this case)
   *
   * NB: It is quite unlikely that you want to set this to `true`.
   *
   * @default false
   */
  createArrayIndexBasedFns: false as boolean,
  /**
   * Default fallback strategy, this can be overridden at the single translation
   * usage level, possible values are:
   *
   * - `"key"`: it prints the untranslated translation key, e.g. `"header.cta"
   * - `""`: it prints an empty string, useful when using translations dynamically
   * based on variable data
   *
   * @default "key"
   */
  fallbackDefaultStrategy: "key" as "key" | "empty",
  /**
   * @default true
   */
  useDefaultLocaleWhenEmpty: true as boolean,
  // TODO: add pluralisation config
  /**
   * Functions generation options
   */
  dictionaries: {
    /**
     * The directory name relative within the code `output` path where the
     * generated dictionaries are written.
     *
     * @default "$dictionary"
     */
    dir: "$dictionary",
    /**
     * Generated `{prefix}_namespace` prefix, prepended to the automatically
     * generated dictionaries objects.
     *
     * @default "$dictionary_"
     */
    prefix: "$dictionary_",
  },
  /**
   * Functions generation options
   */
  functions: {
    /**
     * The directory name relative within the code `output` path where the
     * generated functions are written.
     *
     * @default "$t"
     */
    dir: "$t",
    /**
     * Generated `{prefix}_namespace_path()` functions prefix, prepended to the automatically
     * generated function names.
     *
     * @default "$t_"
     */
    prefix: "$t_",
    /**
     * It creates `t_` functions that returns objects and arrays to use as
     * data source.
     *
     * NB: this greatly increased the generated code, tree shaking will still
     * apply though.
     *
     * @default true
     */
    asData: true as boolean,
  },
  tokens: {
    /** @default ":" */
    namespaceDelimiter: ":",
    /** @default "." */
    keyDelimiter: ".",
    dynamicDelimiters: {
      /** @default "{{" */
      start: "{{",
      /** @default "}}" */
      end: "}}",
    },
  },
};

export type CodeDataTranslationsOptions = typeof codeDataTranslationsOptions;

/**
 * Extract params to interpolate from flat translation's value
 */
function extractTranslationParamsFromPrimitive(
  options: CodeDataTranslationsOptions,
  value: Extract<I18nCompiler.DataTranslationValue, string | number | boolean>,
) {
  if (isString(value)) {
    const { start, end } = options.tokens.dynamicDelimiters;
    const regex = new RegExp(`${start}(.*?)${end}`, "gm");
    const matches = value.match(regex);
    if (matches) {
      return matches
        .map((match) => match.replace(start, "").replace(end, "").trim())
        .reduce((map, paramName) => {
          // TODO: maybe determine the more specific type with some kind of
          // special token used in the route id `[dynamicParam]` portion
          map[paramName] = "stringOrNumber";
          return map;
        }, {} as I18nCompiler.DataParams);
    }
  }
  return;
}

/**
 * Extract params to interpolate from non-flat translation's values
 */
function extractTranslationParamsFromValue(
  options: CodeDataTranslationsOptions,
  value: I18nCompiler.DataTranslationValue,
  params?: I18nCompiler.DataParams,
) {
  if (isPrimitive(value)) {
    const extracted = extractTranslationParamsFromPrimitive(options, value);
    if (extracted) params = { ...(params || {}), ...extracted };

    return params;
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const extracted = extractTranslationParamsFromValue(
        options,
        value[i],
        params,
      );
      if (extracted) params = { ...(params || {}), ...extracted };
    }
  } else {
    for (const key in value) {
      const extracted = extractTranslationParamsFromValue(
        options,
        value[key],
        params,
      );
      if (extracted) params = { ...(params || {}), ...extracted };
    }
  }

  return params;
}

/**
 * We flag translations that have always the same output to optimize the
 * `t` functions implementation since in those cases we do not need to check
 * the current locale.
 *
 * NB: it mutates the data
 */
function flagDataTranslationsEqualValues(
  dataTranslations: I18nCompiler.DataTranslations,
  _options: CodeDataTranslationsOptions,
) {
  for (const key in dataTranslations) {
    const translation = dataTranslations[key];
    let lastCompared: (typeof translation.values)[string] | null = null;
    let areAllEqual = true;

    for (const locale in translation.values) {
      if (lastCompared) {
        if (!areEqual(lastCompared, translation.values[locale])) {
          areAllEqual = false;
          break;
        }
      }
      lastCompared = translation.values[locale];
    }

    if (areAllEqual) dataTranslations[key].equalValues = true;
  }

  return dataTranslations;
}

/**
 * At this point the data translations have been calculated, this happens in a
 * second pass as we need to know all the translations keys to look for plural
 * variations.
 *
 * NB: it mutates the data
 */
function manageDataTranslationsPlurals(
  dataTranslations: I18nCompiler.DataTranslations,
  options: CodeDataTranslationsOptions,
) {
  const pluralTranslationIds =
    Object.keys(dataTranslations).filter<PluralKey>(isPluralKey);

  pluralTranslationIds.forEach((pluralisedId) => {
    const nonPluralisedId = removePluralSuffix(pluralisedId);
    const pluralSuffix = getPluralSuffix(pluralisedId);
    const pluralisedTranslation = dataTranslations[pluralisedId];
    const requiredPluralisedId = getRequiredPluralSuffix(nonPluralisedId);

    // bail if we miss the required pluralised key, which means we have some
    // translations that use seemingly pluralised forms but are not really meant
    // to be pluralised, TODO: we could log this to the user
    if (!pluralTranslationIds.includes(requiredPluralisedId)) {
      return;
    }

    // we need to create it if we only have `x_one` `x_other` but not `x`
    const nonPluralisedTranslationExists = !!dataTranslations[nonPluralisedId];

    // we only need to rearrange plurals defined as `x_one`, `x_other`, if plurals
    // are instead defined as objects `{ one: "", other: "" }` we just keep that
    // object structure for `values`
    if (pluralisedTranslation) {
      if (!nonPluralisedTranslationExists) {
        dataTranslations[nonPluralisedId] = createTranslationEntry(options, {
          id: nonPluralisedId,
          namespace: pluralisedTranslation.namespace,
          // remove the suffix as here the path of the existing pluralised
          // translation will always be something like `myKey_one` or `myKey_other`
          // etc. Since we are creating a new translation entry we need to give it
          // the proper namespace and path by tweaking the existing translation
          // entry's data. See `pluralNoDefault` in mocks test data.json output.
          path: removePluralSuffix(pluralisedTranslation.path as PluralKey),
          // plural values need always to be treated as Primitive values, despite
          // the data structure looks like an object (e.g. { "plural_one": "One", "plural_other": "Some" })
          typeValue: "Primitive",
          // we add this in the for loop here below
          locale: null,
          // we add this in the for loop here below
          value: null,
        });
      }

      const values = dataTranslations[nonPluralisedId].values || {};

      for (const locale in pluralisedTranslation.values) {
        const value = pluralisedTranslation.values[locale];
        // we need to ensure the value is an object for pluralisation, so if
        // we encounter this structure:
        // { "plural": "Plural", "plural_one": "One", "plural_other": "Some" }
        // we just remove the first `plural` value as that key is instead used
        // to grab the right pluralised version from the object value we build
        // from the other plural-suffixed keys. TODO: maybe we could warn the
        // developer of improper usage of the `plural` translation key, which is
        // simply useless and will be unusable
        // prettier-ignore
        values[locale] = isObject(values[locale]) ? values[locale] : {};
        // prettier-ignore
        (values[locale] as Record<PluralSuffix, I18nCompiler.DataTranslationValue>)[pluralSuffix] = value;

        const params = extractTranslationParamsFromValue(options, value);
        if (params) {
          dataTranslations[nonPluralisedId].params = {
            ...(dataTranslations[nonPluralisedId].params || {}),
            ...params,
          };
        }
      }
      if (Object.keys(values).length) {
        dataTranslations[nonPluralisedId].values = values;
        dataTranslations[nonPluralisedId].plural = true;

        // @see data.json:code.translations.$account_$user$profile_pluralAsObject
        const firstLocale = Object.keys(values)[0];
        if (hasOnlyPluralKeys(values[firstLocale] as {})) {
          // plural values need always to be treated as Primitive values, despite
          // the data structure looks like an object (e.g. { "plural_one": "One", "plural_other": "Some" })
          dataTranslations[nonPluralisedId].typeValue = "Primitive";
        }
      }

      // TODO: probaly here we should remove the non-plural keys from `values`
      // as they are anyway accessible from "deeper" functions e.g.
      // `withPluralAndOtherKeys({ count: 3 }) => "One" | "Many"`
      // `withPluralAndOtherKeys_nonPluralKey()` => "Yes"

      // delete ids that we re-arranged in the plural-ready object value
      delete dataTranslations[pluralisedId];
    }
  });
}

const REGEX_TILDE = /~/g;
const REGEX_DASH_DOTS_SEMICOLON = /-|\.|:/g;
const REGEX_SLASHES = /\/|\\/g;
const REGEX_JS_IDENTIFIER = /[^a-zA-Z0-9_$]/gi;
const REGEX_NOT_INITIAL_NUMBER = /^[0-9]/;
const REGEX_CONSECUTIVE_UNDERSCORES = /_+/g;

export function normaliseTranslationTraceIdentifier(
  trace: string,
  prefix = "",
) {
  // return options.functions.prefix + changeCaseSnake(trace);
  let replaced = trace
    // replace tilde
    .replace(REGEX_TILDE, "_")
    // replace dash, dots, semicolon
    .replace(REGEX_DASH_DOTS_SEMICOLON, "_")
    // replace slashes
    .replace(REGEX_SLASHES, "_")
    // ensure valid js identifier, allow only alphanumeric characters and few symbols
    .replace(REGEX_JS_IDENTIFIER, "");

  // ensure the key does not start with a number (invalid js)
  replaced = REGEX_NOT_INITIAL_NUMBER.test(replaced)
    ? "_" + replaced
    : replaced;

  // collapse consecutive underscores
  return (prefix + replaced).replace(REGEX_CONSECUTIVE_UNDERSCORES, "_");
}

function getTranslationFunctionName(
  options: CodeDataTranslationsOptions,
  trace: string,
) {
  return normaliseTranslationTraceIdentifier(trace, options.functions.prefix);
}

function createTranslationEntry(
  options: CodeDataTranslationsOptions,
  {
    id,
    namespace,
    path,
    locale,
    value,
    typeValue,
  }: Pick<
    I18nCompiler.DataTranslation,
    "id" | "namespace" | "path" | "typeValue" | "params"
  > & {
    locale: null | I18nCompiler.Locale;
    value: null | I18nCompiler.DataTranslationValue;
  },
  existing?: I18nCompiler.DataTranslation,
) {
  const params =
    value === null ? null : extractTranslationParamsFromValue(options, value);
  const trace = namespace
    ? namespace + options.tokens.namespaceDelimiter + path
    : path;
  const translation: I18nCompiler.DataTranslation = {
    ...existing,
    id,
    fnName: getTranslationFunctionName(options, trace),
    namespace,
    path,
    trace,
    typeValue,
    values: existing?.values || {},
  };

  // extend values with localised value
  if (locale !== null && value !== null) {
    translation.values[locale] = value;
  }

  // maybe add params
  if (params && Object.keys(params).length) {
    translation.params = params;
  }

  return translation;
}

/**
 * Add entry to translations data
 */
function addDataTranslationEntry(
  options: CodeDataTranslationsOptions,
  dataTranslations: I18nCompiler.DataTranslations,
  {
    id,
    namespace,
    path,
    locale,
    value,
  }: Pick<I18nCompiler.DataTranslation, "id" | "namespace" | "path"> & {
    locale: I18nCompiler.Locale;
    value: I18nCompiler.DataTranslationValue;
  },
) {
  const existing = dataTranslations[id];

  if (isPrimitive(value)) {
    dataTranslations[id] = createTranslationEntry(
      options,
      {
        id,
        namespace,
        path,
        typeValue: "Primitive",
        locale,
        value,
      },
      existing,
    );
  } else {
    if (options.functions.asData) {
      dataTranslations[id] = createTranslationEntry(
        options,
        {
          id,
          namespace,
          path,
          typeValue: isArray(value) ? "Array" : "Object",
          locale,
          value,
        },
        existing,
      );
    }

    if (isArray(value)) {
      if (options.createArrayIndexBasedFns) {
        for (let i = 0; i < value.length; i++) {
          addDataTranslationEntry(options, dataTranslations, {
            id: id + "_" + i,
            namespace,
            // FIXME:TODO: this is not actually supported with the dynamic t function (array index based access)
            path: path + "[" + i + "]",
            locale,
            value: value[i],
          });
        }
      }
    } else {
      for (const key in value) {
        addDataTranslationEntry(options, dataTranslations, {
          id: id + "_" + key,
          namespace,
          path: path + "." + key,
          locale,
          value: value[key],
        });
      }
    }
  }

  return dataTranslations;
}

/**
 * Simply remove the extension, the namespace is the path without it, e.g.:
 *
 * from `path` `~account/~profile/edit.json` we get `"~account/~profile/edit"`
 */
export function translationPathToNamespace(path: string) {
  return join(dirname(path), basename(path, extname(path)));
}

/**
 * Get translation data recursively starting from a specific file
 */
function getCodeDataTranslationsFromFile(
  options: CodeDataTranslationsOptions,
  dataTranslations: I18nCompiler.DataTranslations,
  file: I18nCompiler.DataInputTranslationFile,
): I18nCompiler.DataTranslations {
  const { locale, path } = file;
  // from `path` `~account/~profile/edit.json` we get `"~account/~profile/edit"`
  const namespace = translationPathToNamespace(path);
  let id = namespace;

  for (const key in file.data) {
    const value = file.data[key];
    // this is just an id we use internally, we do not really care about appling
    // the user option, actually that would make the id inconsistent for nothing
    // if (key) id = namespace + options.tokens.namespaceDelimiter + key;
    if (key) id = namespace + ":" + key;

    addDataTranslationEntry(options, dataTranslations, {
      id,
      namespace,
      path: key,
      locale,
      value,
    });
  }

  return dataTranslations;
}

function getCodeDataTranslationsFromDictionary(
  options: CodeDataTranslationsOptions,
  dataTranslations: I18nCompiler.DataTranslations,
  dictionary: NonNullable<I18nCompiler.DataInput["translations"]>[string],
  locale: I18nCompiler.Locale,
): I18nCompiler.DataTranslations {
  for (const key in dictionary) {
    // this is just an id we use internally, we do not really care about appling
    // the user option, actually that would make the id inconsistent for nothing
    // if (key) id = namespace + options.tokens.namespaceDelimiter + key;
    const id = key;
    const value = dictionary[key];

    addDataTranslationEntry(options, dataTranslations, {
      id,
      namespace: "",
      path: key,
      locale,
      value,
    });
  }

  return dataTranslations;
}

/**
 * Get translations data
 */
export let getCodeDataTranslations = (
  _config: I18nCompiler.Config,
  options: CodeDataTranslationsOptions,
  { translationFiles, translations }: I18nCompiler.DataInput,
) => {
  const { ignorePaths } = options;
  const filteredFiles = filterInputTranslationFiles(
    translationFiles,
    ignorePaths,
  );
  let dataTranslations: I18nCompiler.DataTranslations = {};

  for (let i = 0; i < filteredFiles.length; i++) {
    getCodeDataTranslationsFromFile(
      options,
      dataTranslations,
      filteredFiles[i],
    );
  }

  for (const locale in translations) {
    const dictionary = translations[locale];
    getCodeDataTranslationsFromDictionary(
      options,
      dataTranslations,
      dictionary,
      locale,
    );
  }

  manageDataTranslationsPlurals(dataTranslations, options);
  flagDataTranslationsEqualValues(dataTranslations, options);

  return objectSort(dataTranslations);
};

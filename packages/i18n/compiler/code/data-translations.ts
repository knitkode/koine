import { basename, dirname, extname, join, sep } from "node:path";
import {
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
   * - when `false`: if `fnsAsDataCodes` is `true` it outputs `t_myKey` otherwise
   * it outputs nothing (TODO: maybe we could log this info in this case)
   *
   * NB: It is quite unlikely that you want to set this to `true`.
   *
   * @default false
   */
  createArrayIndexBasedFns: false as boolean,
  // TODO: add pluralisation config
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
     * Generated `namespace_tKey()` functions prefix, prepended to the automatically
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
          // TODO: maybe determine the more specific type with some kind of special
          // token used in the route id `[dynamicParam]` portion
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

// function addDataTranslationEntryForObjectValue(
//   options: CodeDataTranslationsOptions,
//   id: string,
//   locale: I18nCompiler.Locale,
//   value: Exclude<Extract<I18nCompiler.DataTranslationValue, object>, string[]>,
//   dataTranslations: I18nCompiler.DataTranslations,
// ) {
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
// }

/**
 * At this point the data translations have been calculated, this happens in a
 * second pass as we need to know all the translations keys to look for plural
 * variations.
 *
 * NB: we mutate the `dataTranslations`
 */
function manageDataTranslationsPlurals(
  options: CodeDataTranslationsOptions,
  dataTranslations: I18nCompiler.DataTranslations,
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

  return dataTranslations;
}

const slashRegex = new RegExp(sep, "g");

function getTranslationFunctionName(
  options: CodeDataTranslationsOptions,
  fullKey: string,
) {
  // return options.functions.prefix + changeCaseSnake(fullKey);
  let replaced = fullKey
    // replace tilde
    .replace(/~/g, "_")
    // replace dash, dots, semicolon
    .replace(/-|\.|:/g, "_")
    // replce slashes
    .replace(slashRegex, "_")
    // ensure valid js identifier, allow only alphanumeric characters and few symbols
    .replace(/[^a-zA-Z0-9_$]/gi, "");

  // ensure the key does not start with a number (invalid js)
  replaced = /^[0-9]/.test(replaced) ? "_" + replaced : replaced;

  // collapse consecutive underscores
  return (options.functions.prefix + replaced).replace(/_+/g, "_");
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
  const fullKey = namespace + options.tokens.namespaceDelimiter + path;
  const translation: I18nCompiler.DataTranslation = {
    ...existing,
    id,
    fnName: getTranslationFunctionName(options, fullKey),
    namespace,
    path,
    fullKey,
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
 * Get translation data recursively starting from a specific file
 */
function getCodeDataTranslationsFromFile(
  options: CodeDataTranslationsOptions,
  dataTranslations: I18nCompiler.DataTranslations,
  file: I18nCompiler.DataInputTranslationFile,
): I18nCompiler.DataTranslations {
  const { locale, path } = file;
  // from `path` `~account/~profile/edit.json` we get `"~account/~profile/edit"`
  const namespace = join(dirname(path), basename(path, extname(path)));
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
    getCodeDataTranslationsFromFile(options, dataTranslations, file),
  );

  dataTranslations = manageDataTranslationsPlurals(options, dataTranslations);

  // sort
  dataTranslations = objectSort(dataTranslations);

  return dataTranslations;
};

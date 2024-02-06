import { basename, dirname, extname, join, sep } from "node:path";
import { isArray, isPrimitive, isString } from "@koine/utils";
import { PluralKey, isPluralKey, removePluralSuffix } from "./pluralisation";
import type { I18nCodegen } from "./types";

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
  config: I18nCodegen.Config,
  value: Extract<I18nCodegen.DataTranslationValue, string | number | boolean>,
) => {
  if (isString(value)) {
    const { start, end } = config.translations.dynamicDelimiters;
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
        }, {} as I18nCodegen.DataParams);
    }
  }
  return;
};

const extractTranslationParamsFromValue = (
  config: I18nCodegen.Config,
  value: I18nCodegen.DataTranslationValue,
  params: I18nCodegen.DataParams = {},
) => {
  if (isPrimitive(value)) {
    const extracted = extractTranslationParamsFromPrimitive(config, value);
    if (extracted) params = { ...params, ...extracted };

    return params;
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const extracted = extractTranslationParamsFromPrimitive(config, value[i]);
      if (extracted) params = { ...params, ...extracted };
    }
  } else {
    for (const key in value) {
      const extracted = extractTranslationParamsFromValue(
        config,
        value[key],
        params,
      );
      if (extracted) params = { ...params, ...extracted };
    }
  }
  return {};
};

// if (!query || typeof query.count !== 'number') return key

// const numKey = `${key}_${query.count}`
// if (getDicValue(dic, numKey, config, options) !== undefined) return numKey

// const pluralKey = `${key}_${pluralRules.select(query.count)}`
// if (getDicValue(dic, pluralKey, config, options) !== undefined) {
//   return pluralKey
// }

// const nestedNumKey = `${key}.${query.count}`
// if (getDicValue(dic, nestedNumKey, config, options) !== undefined)
//   return nestedNumKey

// const nestedKey = `${key}.${pluralRules.select(query.count)}`
// if (getDicValue(dic, nestedKey, config, options) !== undefined)
//   return nestedKey

// return key

const addDataTranslationEntryForObjectValue = (
  config: I18nCodegen.Config,
  id: string,
  locale: I18nCodegen.Locale,
  value: Exclude<Extract<I18nCodegen.DataTranslationValue, object>, string[]>,
  dataTranslations: I18nCodegen.DataTranslations,
) => {
  // if (hasOnlyPluralKeys(value)) {
  //   return `'${key}': string;`;
  // }
  // if (!isArray(value) && isObject(value)) {
  //   if (hasOnlyPluralKeys(value)) {
  //     return `'${key}': string;`;
  //   }
  //   if (hasPlurals(value)) {
  //     return `'${key}': string | ${buildTypeForValue(pickNonPluralValue(value))}`;
  //   }
  // }
  // return `'${key}': ${buildTypeForValue(value)}`;
};

/**
 * At this point the data translations have been calculated, this happens in a
 * second pass as we need to know all the translations keys to look for plural
 * variations.
 *
 * NB: we mutate the `dataTranslations`
 */
const manageDataTranslationsPlurals = (
  config: I18nCodegen.Config,
  dataTranslations: I18nCodegen.DataTranslations,
) => {
  const pluralTranslationIds =
    Object.keys(dataTranslations).filter<PluralKey>(isPluralKey);
  pluralTranslationIds.forEach((translationIdPluralised) => {
    const id = removePluralSuffix(translationIdPluralised);
    // const tDataPlural = dataTranslations[translationIdPluralised];

    if (dataTranslations[id]) {
      dataTranslations[id].plural = true;
      // dataTranslations[id].pluralValues = dataTranslations[id].pluralValues || {};
      // dataTranslations[id].pluralValues[tDataPlural.]
    } else {
      // addDataTranslationEntry(config, translationIdUnpluralised, )
    }

    delete dataTranslations[translationIdPluralised];
  });

  return dataTranslations;
};

/**
 * Add entry to translations data
 */
const addDataTranslationEntry = (
  config: I18nCodegen.Config,
  id: string,
  locale: I18nCodegen.Locale,
  value: I18nCodegen.DataTranslationValue,
  dataTranslations: I18nCodegen.DataTranslations,
) => {
  if (isPrimitive(value)) {
    const params = extractTranslationParamsFromPrimitive(config, value);
    dataTranslations[id] = dataTranslations[id] || {};
    dataTranslations[id].values = dataTranslations[id].values || {};
    dataTranslations[id].values[locale] = value;
    dataTranslations[id].typeValue = "Primitive";
    if (params) dataTranslations[id].params = params;
  } else {
    if (config.translations.fnsAsDataSources) {
      // const params = extractTranslationParamsFromValue(
      //   config,
      //   value,
      // );
      const typeValue = isArray(value) ? "Array" : "Object";
      dataTranslations[id] = dataTranslations[id] || {};
      dataTranslations[id].values = dataTranslations[id].values || {};
      dataTranslations[id].values[locale] = value;
      dataTranslations[id].typeValue = typeValue;
      // if (params) dataTranslations[id].params = params;
    }

    if (isArray(value)) {
      if (config.translations.createArrayIndexBasedFns) {
        for (let i = 0; i < value.length; i++) {
          addDataTranslationEntry(
            config,
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
          config,
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
const getDataTranslationsFromFile = (
  config: I18nCodegen.Config,
  file: I18nCodegen.TranslationFile,
  dataTranslations: I18nCodegen.DataTranslations,
): I18nCodegen.DataTranslations => {
  const { locale, path } = file;
  const filename = join(dirname(path), basename(path, extname(path)));

  for (const tKey in file.data) {
    const tValue = file.data[tKey];
    const id = normaliseTranslationKey(filename + (tKey ? "_" + tKey : ""));
    addDataTranslationEntry(config, id, locale, tValue, dataTranslations);
  }

  return dataTranslations;
};

/**
 * Get translations data
 */
export let getDataTranslations = (
  config: I18nCodegen.Config,
  files: I18nCodegen.TranslationFile[],
) => {
  let dataTranslations: I18nCodegen.DataTranslations = {};

  for (let i = 0; i < files.length; i++) {
    if (files[i].path !== config.routes.translationJsonFileName) {
      getDataTranslationsFromFile(config, files[i], dataTranslations);
    }
  }

  dataTranslations = manageDataTranslationsPlurals(config, dataTranslations);

  // sort
  dataTranslations = Object.fromEntries(
    Object.entries(dataTranslations).sort(),
  );

  // console.log("generateTypes: outputDir", outputDir, "outputPath", outputPath);
  return dataTranslations;
};

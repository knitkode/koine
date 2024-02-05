import { basename, extname, sep } from "node:path";
import { changeCaseSnake, isArray, isPrimitive, isString } from "@koine/utils";
import type { I18nCodegen } from "./types";

const slashRegex = new RegExp(sep, "g");

const extractTranslationParamsFromPrimitive = (
  config: I18nCodegen.Config,
  value: Extract<I18nCodegen.DataTranslationValue, string | number | boolean>,
) => {
  if (isString(value)) {
    const { start, end } = config.translations.dynamicDelimiters;
    const regex = new RegExp(`${start}(.*?)${end}`, "gm");
    const matches = value.match(regex);
    if (matches) {
      const paramsNames = matches.map((match) =>
        match.replace(start, "").replace(end, "").trim(),
      );
      const params = paramsNames.reduce((map, paramName) => {
        // TODO: maybe determine the more specific type with some kind of special
        // token used in the route id `[dynamicParam]` portion
        map[paramName] = "stringOrNumber";
        return map;
      }, {} as I18nCodegen.DataTranslationParams);

      return { paramsNames, params };
    }
  }
  return {};
};

const extractTranslationParamsFromValue = (
  config: I18nCodegen.Config,
  value: I18nCodegen.DataTranslationValue,
  paramsNames: string[] = [],
  params: I18nCodegen.DataTranslationParams = {},
) => {
  if (isPrimitive(value)) {
    const extracted = extractTranslationParamsFromPrimitive(config, value);
    paramsNames = [...paramsNames, ...(extracted.paramsNames ?? [])];
    params = { ...params, ...(extracted.params ?? {}) };

    return { paramsNames, params };
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const extracted = extractTranslationParamsFromPrimitive(config, value[i]);
      paramsNames = [...paramsNames, ...(extracted.paramsNames ?? [])];
      params = { ...params, ...(extracted.params ?? {}) };
    }
  } else {
    for (const key in value) {
      const extracted = extractTranslationParamsFromValue(
        config,
        value[key],
        paramsNames,
        params,
      );
      paramsNames = [...paramsNames, ...(extracted.paramsNames ?? [])];
      params = { ...params, ...(extracted.params ?? {}) };
    }
  }
  return {};
};

const addDataTranslationEntry = (
  config: I18nCodegen.Config,
  id: string,
  locale: I18nCodegen.Locale,
  value: I18nCodegen.DataTranslationValue,
  dataTranslations: I18nCodegen.DataTranslations,
) => {
  if (isPrimitive(value)) {
    const { params, paramsNames } = extractTranslationParamsFromPrimitive(
      config,
      value,
    );
    dataTranslations[id] = dataTranslations[id] || {};
    dataTranslations[id].values = dataTranslations[id].values || {};
    dataTranslations[id].values[locale] = value;
    dataTranslations[id].plural = false;
    dataTranslations[id].typeValue = "Primitive";
    dataTranslations[id].params = params;
    dataTranslations[id].paramsNames = paramsNames;
    dataTranslations[id].dynamic = !!paramsNames;
  } else {
    if (config.translations.fnsAsDataSources) {
      // const { params, paramsNames } = extractTranslationParamsFromValue(
      //   config,
      //   value,
      // );
      const typeValue = isArray(value) ? "Array" : "Object";
      const tId = id; // id.startsWith("$as") ? id : "$as" + typeValue + "_" + id;
      dataTranslations[tId] = dataTranslations[tId] || {};
      dataTranslations[tId].values = dataTranslations[tId].values || {};
      dataTranslations[tId].values[locale] = value;
      dataTranslations[tId].plural = false;
      dataTranslations[tId].typeValue = typeValue;
      // dataTranslations[id].params = params;
      // dataTranslations[id].paramsNames = paramsNames;
      // dataTranslations[id].dynamic = !!paramsNames;
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
          id + "_" + changeCaseSnake(tKey),
          locale,
          value[tKey],
          dataTranslations,
        );
      }
    }
  }

  return dataTranslations;
};

const getNamespaceData = (
  config: I18nCodegen.Config,
  file: I18nCodegen.TranslationFile,
  dataTranslations: I18nCodegen.DataTranslations,
): I18nCodegen.DataTranslations => {
  const { locale, path } = file;
  const filename = basename(path, extname(path));
  const idNamespace = filename
    .replace(slashRegex, "_")
    .replace(/~/g, "_")
    // ensure valid js identifier, allow only alphanumeric characters and underscore
    .replace(/[^a-zA-Z0-9_]/gim, "");

  for (const tKey in file.data) {
    const tValue = file.data[tKey];
    const id = idNamespace + "_" + changeCaseSnake(tKey);
    addDataTranslationEntry(config, id, locale, tValue, dataTranslations);
  }

  return dataTranslations;
};

export let getDataTranslations = (
  config: I18nCodegen.Config,
  files: I18nCodegen.TranslationFile[],
) => {
  let out: I18nCodegen.DataTranslations = {};

  for (let i = 0; i < files.length; i++) {
    if (files[i].path !== config.routesTranslationJsonFileName) {
      getNamespaceData(config, files[i], out);
    }
  }

  // console.log("generateTypes: outputDir", outputDir, "outputPath", outputPath);
  return out;
};

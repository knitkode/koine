import {
  areEqual,
  forin,
  isArray,
  isBoolean,
  isNumber,
  isPrimitive,
  isString,
} from "@koine/utils";
import type { I18nCompiler } from "../../compiler";
import { dataParamsToTsInterfaceBody } from "../../compiler/helpers";

const getTranslationValueOutput = (
  value: I18nCompiler.DataTranslationValue,
) => {
  if (isString(value) || isNumber(value)) {
    return `"${value}"`;
  } else if (isBoolean(value)) {
    return `${value}`;
  } else if (isArray(value)) {
    return JSON.stringify(value);
  }
  return `(${JSON.stringify(value)})`;
};

const areEqualTranslationsValues = (
  a: I18nCompiler.DataTranslationValue,
  b: I18nCompiler.DataTranslationValue,
) => areEqual(a, b);

const getFunctionBodyWithLocales = (
  config: I18nCompiler.Config,
  perLocaleValues: I18nCompiler.DataTranslation["values"],
) => {
  const { defaultLocale } = config;
  let output = "";
  forin(perLocaleValues, (locale, value) => {
    if (
      locale !== defaultLocale &&
      !areEqualTranslationsValues(value, perLocaleValues[defaultLocale])
    ) {
      output += `locale === "${locale}" ? ${getTranslationValueOutput(value)} : `;
    }
  });

  output += getTranslationValueOutput(perLocaleValues[defaultLocale]);

  return output;
};

export default ({ config, data }: I18nCompiler.AdapterArg) => {
  let output = `
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
import type { I18n } from "./types";
import { tInterpolateParams } from "./tInterpolateParams";

`;

  forin(data.code.translations, (translationId, { values, params, plural }) => {
    const name = `${config.code.translations.fnsPrefix}${translationId}`;
    if (params && plural) {
      params["count"] = "number";
    }
    const argParam = params
      ? `params: { ${dataParamsToTsInterfaceBody(params)} }`
      : "";

    // for ergonomy always allow the user to pass the locale
    const argLocale = "locale?: I18n.Locale";
    const args = [argParam, argLocale].filter(Boolean).join(", ");
    // const formatArgParams = params ? ", params" : "";

    output += `export let ${name} = (${args}) => `;
    let outputFnReturn = "";

    if (isPrimitive(values)) {
      outputFnReturn += getTranslationValueOutput(values);
    } else {
      outputFnReturn += getFunctionBodyWithLocales(config, values);
    }
    if (params) {
      outputFnReturn = `tInterpolateParams(${outputFnReturn}, params);`;
    } else {
      outputFnReturn = `${outputFnReturn};`;
    }

    output += outputFnReturn;
    // TODO: t interpolation and pluralisation
    // if (isString(values)) {
    //   output += `toFormat(${formatArgLocale}, "${values}"${formatArgParams});`;
    // } else {
    //   output += `toFormat(${formatArgLocale}, ${getFunctionBodyWithLocales(
    //     data,
    //     values,
    //   )}${formatArgParams});`;
    // }

    output += `\n`;
  });

  return output;
};

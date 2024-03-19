import {
  areEqual,
  isArray,
  isBoolean,
  isNumber,
  isPrimitive,
  isString,
} from "@koine/utils";
import { dataParamsToTsInterfaceBody } from "../../compiler/helpers";
import type { I18nCompiler } from "../../compiler/types";

// /**
//  * Control plural keys depending the {{count}} variable
//  */
// function plural(
//   pluralRules: Intl.PluralRules,
//   dic: I18nDictionary,
//   key: string,
//   config: I18nConfig,
//   query?: TranslationQuery | null,
//   options?: {
//     returnObjects?: boolean
//     fallback?: string | string[]
//   }
// ): string {
//   if (!query || typeof query.count !== 'number') return key

//   const numKey = `${key}_${query.count}`
//   if (getDicValue(dic, numKey, config, options) !== undefined) return numKey

//   const pluralKey = `${key}_${pluralRules.select(query.count)}`
//   if (getDicValue(dic, pluralKey, config, options) !== undefined) {
//     return pluralKey
//   }

//   const nestedNumKey = `${key}.${query.count}`
//   if (getDicValue(dic, nestedNumKey, config, options) !== undefined)
//     return nestedNumKey

//   const nestedKey = `${key}.${pluralRules.select(query.count)}`
//   if (getDicValue(dic, nestedKey, config, options) !== undefined)
//     return nestedKey

//   return key
// }

// const getP = (dic) => {
//   return
// }

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

  for (const locale in perLocaleValues) {
    const value = perLocaleValues[locale];
    if (
      locale !== defaultLocale &&
      !areEqualTranslationsValues(value, perLocaleValues[defaultLocale])
    ) {
      output += `locale === "${locale}" ? ${getTranslationValueOutput(value)} : `;
    }
  }

  output += getTranslationValueOutput(perLocaleValues[defaultLocale]);

  return output;
};

export default ({
  config,
  options,
  translations,
}: I18nCompiler.AdapterArg<"js">) => {
  let output = `
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
import type { I18n } from "./types";
import { tInterpolateParams } from "./tInterpolateParams";
import { tPluralise } from "./tPluralise";

`;

  for (const translationId in translations) {
    let { values, params, plural } = translations[translationId];
    const name = `${options.translations.fnsPrefix}${translationId}`;
    if (plural) {
      if (params) {
        params["count"] = "number";
      } else {
        params = { count: "number" };
      }
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
    if (plural) {
      outputFnReturn = `tPluralise(${outputFnReturn}, params.count)`;
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
  }

  return output;
};

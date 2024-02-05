import {
  areEqual,
  forin,
  isArray,
  isBoolean,
  isNumber,
  isPrimitive,
  isString,
} from "@koine/utils";
import type { I18nCodegen } from "../../codegen";

const getTranslationValueOutput = (value: I18nCodegen.DataTranslationValue) => {
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
  a: I18nCodegen.DataTranslationValue,
  b: I18nCodegen.DataTranslationValue,
) => areEqual(a, b);

const getFunctionBodyWithLocales = (
  data: I18nCodegen.Data,
  perLocaleValues: I18nCodegen.DataTranslation["values"],
) => {
  let output = "";
  forin(perLocaleValues, (locale, value) => {
    if (
      locale !== data.defaultLocale &&
      !areEqualTranslationsValues(value, perLocaleValues[data.defaultLocale])
    ) {
      output += `locale === "${locale}" ? ${getTranslationValueOutput(value)} : `;
    }
  });

  output += getTranslationValueOutput(perLocaleValues[data.defaultLocale]);

  return output;
};

export default (data: I18nCodegen.Data) => {
  let output = `
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { I18n } from "./types";
import { tInterpolateParams } from "./tInterpolateParams";

`;

  forin(
    data.translations,
    (translationId, { typeName, dynamic, values, params }) => {
      const name = `t_${translationId}`;
      const paramsType = JSON.stringify(params);

      const argParam = dynamic ? `params: ${paramsType}` : "";
      // for ergonomy always allow the user to pass the locale
      const argLocale = "locale?: I18n.Locale";
      const args = [argParam, argLocale].filter(Boolean).join(", ");
      // const formatArgParams = dynamic ? ", params" : "";

      output += `export const ${name} = (${args}) => `;
      let outputFnReturn = "";

      if (isPrimitive(values)) {
        outputFnReturn += getTranslationValueOutput(values);
      } else {
        outputFnReturn += getFunctionBodyWithLocales(data, values);
      }
      if (dynamic) {
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
    },
  );

  return output;
};

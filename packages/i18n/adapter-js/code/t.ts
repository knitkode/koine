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
  const eslint = [
    "/* eslint-disable @typescript-eslint/no-unused-vars */",
    "/* eslint-disable prefer-const */",
  ];
  const imports = [`import type { I18n } from "./types";`];
  const declarations: string[] = [];
  const functionNames: string[] = [];
  let needsImport_tInterpolateParams = false;
  let needsImport_tPluralise = false;

  for (const translationId in translations) {
    let declaration = "";
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

    declaration += `export let ${name} = (${args}) => `;
    let declarationReturn = "";

    if (isPrimitive(values)) {
      declarationReturn += getTranslationValueOutput(values);
    } else {
      declarationReturn += getFunctionBodyWithLocales(config, values);
    }
    if (plural) {
      needsImport_tPluralise = true;
      declarationReturn = `tPluralise(${declarationReturn}, params.count)`;
    }
    if (params) {
      needsImport_tInterpolateParams = true;
      declarationReturn = `tInterpolateParams(${declarationReturn}, params);`;
    } else {
      declarationReturn = `${declarationReturn};`;
    }

    declaration += declarationReturn;

    declarations.push(declaration);
    functionNames.push(name);
  }

  if (needsImport_tInterpolateParams) {
    imports.push(`import { tInterpolateParams } from "./tInterpolateParams";`);
  }
  if (needsImport_tPluralise) {
    imports.push(`import { tPluralise } from "./tPluralise";`);
  }

  let output = "";
  output += eslint.join("\n");
  output += imports.join("\n");

  output += declarations.join("\n");

  // TODO: verify the impact of the following on bundle size, its relation to
  // modularizeImports and maybe make this controllable through an adapter
  // option
  output += `\n\n`;
  output += `export const t = {\n  ${functionNames.join(",\n  ")}\n};`;
  output += `\n\n`;
  output += `export default t;`;

  return output;
};

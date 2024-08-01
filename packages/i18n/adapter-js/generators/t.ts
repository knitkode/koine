import {
  areEqual,
  isArray,
  isBoolean,
  isNumber,
  isPrimitive,
  isString,
} from "@koine/utils";
import { createGenerator } from "../../compiler/createAdapter";
import {
  type FunctionData,
  dataParamsToTsInterfaceBody,
  getImportDir,
} from "../../compiler/helpers";
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

const getImports = (folderUp = 0) => {
  const dir = getImportDir(folderUp);
  return {
    types: `import type { I18n } from "${dir}types";`,
    tInterpolateParams: `import { tInterpolateParams } from "${dir}tInterpolateParams";`,
    tPluralise: `import { tPluralise } from "${dir}tPluralise";`,
  };
};

// TODO: check whether adding /*#__PURE__*/ annotation changes anything
export default createGenerator("js", (data) => {
  const {
    config,
    options: {
      adapter: { modularized },
      translations: { fnsPrefix },
    },
    translations,
  } = data;
  const functions: FunctionData[] = [];
  const allImports: Set<string> = new Set();
  // if the user does not specifiy a custom prefix by default we prepend `t_`
  // when `modularized` option is true
  const fnPrefix = fnsPrefix || (modularized ? "$t_" : "");

  allImports.add(getImports().types);

  for (const translationId in translations) {
    let needsImport_tInterpolateParams = false;
    let needsImport_tPluralise = false;
    let { values, params, plural } = translations[translationId];

    const name = `${fnPrefix}${translationId}`;
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

    let declaration = `export let ${name} = (${args}) => `;
    let declarationReturn = "";
    const imports = [getImports(1).types];

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

    if (needsImport_tInterpolateParams) {
      imports.push(getImports(1).tInterpolateParams);
      allImports.add(getImports().tInterpolateParams);
    }
    if (needsImport_tPluralise) {
      imports.push(getImports(1).tPluralise);
      allImports.add(getImports().tPluralise);
    }

    functions.push({ name, declaration, imports });
  }

  return modularized
    ? (functions.reduce((map, fn) => {
        map[fn.name] = {
          // TODO: weak point: we strip the trailing underscore but the user
          // might defined a different prefix for these functions
          dir: fnPrefix.replace(/_*$/, ""),
          name: fn.name,
          ext: "ts",
          index: true,
          content: () => {
            let output = "";
            output += Array.from(fn.imports).join("\n") + `\n\n`;
            output += fn.declaration;
            output += `\n\n`;
            output += `export default ${fn.name};`;

            return output;
          },
        };
        return map;
        // NOTE: `as never` so that we don't get a common string in the union of the generated files' ids
      }, {} as I18nCompiler.AdapterGeneratorResult) as never)
    : {
        $t: {
          name: "$t",
          ext: "ts",
          index: true,
          content: () => {
            let output = "";
            output += Array.from(allImports).join("\n") + `\n\n`;
            output += functions.map((f) => f.declaration).join("\n");
            // TODO: verify the impact of the following on bundle size, its
            // relation to modularizeImports and maybe make this controllable
            // through an adapter option
            // output += `\n\n`;
            // output += `export const $t = {\n  ${functions.map((f) => f.name).join(",\n  ")}\n};`;
            // output += `\n\n`;
            // output += `export default $t;`;

            return output;
          },
        },
      };
});

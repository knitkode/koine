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
  FunctionsCompiler,
  type FunctionsCompilerDataArg,
} from "../../compiler/functions";
import { dataParamsToTsInterfaceBody } from "../../compiler/helpers";
import { ImportsCompiler } from "../../compiler/imports";
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
  defaultLocale: I18nCompiler.Config["defaultLocale"],
  perLocaleValues: I18nCompiler.DataTranslation["values"],
) => {
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

const importsMap = {
  types: new ImportsCompiler({
    path: "types",
    named: [{ name: "I18n", type: true }],
  }),
  tInterpolateParams: new ImportsCompiler({
    path: "tInterpolateParams",
    named: [{ name: "tInterpolateParams" }],
  }),
  tPluralise: new ImportsCompiler({
    path: "tPluralise",
    named: [{ name: "tPluralise" }],
  }),
};

const getTFunctions = (
  translations: I18nCompiler.DataTranslations,
  options: {
    defaultLocale: string;
    modularized: boolean;
    fnsPrefix: string;
  },
) => {
  const { defaultLocale, modularized, fnsPrefix } = options;
  const functions: FunctionsCompiler[] = [];
  const allImports: Set<ImportsCompiler> = new Set();
  // if the user does not specifiy a custom prefix by default we prepend `$t_`
  // when `modularized` option is true
  const fnPrefix = fnsPrefix || (modularized ? "$t_" : "");

  allImports.add(importsMap.types);

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
    const args: FunctionsCompilerDataArg[] = [];
    if (params) {
      args.push({
        name: "params",
        type: `{ ${dataParamsToTsInterfaceBody(params)} }`,
        optional: false,
      });
    }
    // for ergonomy always allow the user to pass the locale
    args.push({ name: "locale", type: "I18n.Locale", optional: true });

    let body = "";
    const imports = [importsMap.types];

    if (isPrimitive(values)) {
      body += getTranslationValueOutput(values);
    } else {
      body += getFunctionBodyWithLocales(defaultLocale, values);
    }
    if (plural) {
      needsImport_tPluralise = true;
      body = `tPluralise(${body}, params.count)`;
    }
    if (params) {
      needsImport_tInterpolateParams = true;
      body = `tInterpolateParams(${body}, params);`;
    } else {
      body += ";";
    }

    if (needsImport_tInterpolateParams) {
      imports.push(importsMap.tInterpolateParams);
      allImports.add(importsMap.tInterpolateParams);
    }
    if (needsImport_tPluralise) {
      imports.push(importsMap.tPluralise);
      allImports.add(importsMap.tPluralise);
    }

    functions.push(new FunctionsCompiler({ imports, name, args, body }));
  }

  return { functions, fnPrefix, allImports };
};

// TODO: check whether adding /*#__PURE__*/ annotation changes anything
export default createGenerator("js", (data) => {
  const {
    config: { defaultLocale },
    options: {
      adapter: { modularized },
      translations: { fnsPrefix },
    },
    translations,
  } = data;
  const { functions, fnPrefix, allImports } = getTFunctions(translations, {
    defaultLocale,
    modularized,
    fnsPrefix,
  });

  return modularized
    ? (functions.reduce((map, fn) => {
        // TODO: weak point: we strip the trailing underscore but the user
        // might defined a different prefix for these functions
        const dir = fnPrefix.replace(/_*$/, "");

        map[fn.name] = {
          dir,
          name: fn.name,
          ext: "ts",
          index: true,
          content: () => {
            return fn.$out("ts", {
              imports: { folderUp: 1 },
              exports: "both",
            });
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
            output += ImportsCompiler.outMany("ts", allImports, {
              folderUp: 0,
            });
            output += FunctionsCompiler.outMany("ts", functions, {
              imports: false,
              exports: "named",
            });
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

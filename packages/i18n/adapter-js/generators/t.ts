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
  type FunctionsCompilerBodyOptions,
  type FunctionsCompilerDataArg,
} from "../../compiler/functions";
import {
  GLOBAL_I18N_IDENTIFIER,
  compileDataParamsToType,
} from "../../compiler/helpers";
import { ImportsCompiler } from "../../compiler/imports";
import type { I18nCompiler } from "../../compiler/types";
import { getImportTypes } from "./types";

// TODO: make this property name configurable through `translations` options?
const PLURAL_COUNT_PROPERTY = "count";

export function getTFunction(
  translation: I18nCompiler.DataTranslation,
  options: Pick<I18nCompiler.Config, "defaultLocale" | "single">,
) {
  const { params: rawParams, plural } = translation;
  const { single } = options;
  const { body, imports } = getTFunctionBodyAndImports(translation, options);
  const args: FunctionsCompilerDataArg[] = [];
  // add the plural realted param wihtout mutating the translation params data
  const params = rawParams
    ? plural
      ? { ...rawParams, [PLURAL_COUNT_PROPERTY]: "number" as const }
      : rawParams
    : plural
      ? {
          [PLURAL_COUNT_PROPERTY]: "number" as const,
        }
      : null;

  if (params) {
    args.push({
      name: "params",
      type: compileDataParamsToType(params),
      optional: false,
      description:
        "Dynamic values to interpolate in the translation string" +
        (plural ? " (pass `count` to determine the plural version)" : ""),
    });
  }

  // for ergonomy always allow the user to pass the locale even if
  // hasValuableLocalisation is false
  args.push({
    name: "locale",
    type: "I18n.Locale",
    optional: true,
    description:
      "Use this to override the current locale" +
      (single ? " (in case you add other locales to your project)" : ""),
    defaults: "current locale",
  });

  return { body, args, imports };
}

function getTFunctionBodyAndImports(
  translation: I18nCompiler.DataTranslation,
  options: Pick<I18nCompiler.Config, "defaultLocale" | "single">,
) {
  const { values, params, plural, typeValue, equalValues } = translation;
  const { defaultLocale, single } = options;
  const hasValuableLocalisation = !single && !equalValues;
  const imports = [importsMap.types];

  if (plural) {
    imports.push(importsMap.i18nPluralise);
  }

  if (params) {
    if (typeValue === "Primitive") {
      imports.push(importsMap.i18nInterpolateParams);
    } else if (typeValue === "Array" || typeValue === "Object") {
      imports.push(importsMap.i18nInterpolateParamsDeep);
    }
  }

  return {
    imports,
    body: (functionBodyOpts: FunctionsCompilerBodyOptions) => {
      // let body = ""; // with implicitReturn: true
      let body = hasValuableLocalisation
        ? "locale = locale || global." + GLOBAL_I18N_IDENTIFIER + "; "
        : "";
      body += "return ";

      let returns = "";

      if (isPrimitive(values)) {
        returns += getTranslationValueOutput(values, functionBodyOpts);
      } else {
        returns += getTFunctionBodyWithLocales(
          defaultLocale,
          values,
          hasValuableLocalisation,
          functionBodyOpts,
        );
      }
      if (plural) {
        returns = `i18nPluralise(${returns}, params.${PLURAL_COUNT_PROPERTY})`;
      }

      // NOTE: here params does not have `count`, that does not need to be
      // interpolated, see output in __mocks__ where $t_account_user_profile_pluralAsObject
      // should not need the presence of `i18nInterpolateParamsDeep`
      if (params) {
        if (typeValue === "Primitive") {
          returns = `i18nInterpolateParams(${returns}, params)`;
        } else if (typeValue === "Array" || typeValue === "Object") {
          returns = `i18nInterpolateParamsDeep(${returns}, params)`;
        }
      }
      return body + returns;
    },
  };
}

function getTranslationValueOutput(
  value: I18nCompiler.DataTranslationValue,
  { format }: FunctionsCompilerBodyOptions,
) {
  const asConst = format === "ts" ? " as const" : "";
  if (isString(value) || isNumber(value)) {
    return `"${value}"${asConst}`;
  } else if (isBoolean(value)) {
    return `${value}`;
  } else if (isArray(value)) {
    return JSON.stringify(value) + asConst;
  }
  return `(${JSON.stringify(value)}${asConst})`;
}

function getTFunctionBodyWithLocales(
  defaultLocale: I18nCompiler.Config["defaultLocale"],
  perLocaleValues: I18nCompiler.DataTranslation["values"],
  hasValuableLocalisation: boolean,
  functionBodyOpts: FunctionsCompilerBodyOptions,
) {
  let output = "";

  if (hasValuableLocalisation) {
    for (const locale in perLocaleValues) {
      const value = perLocaleValues[locale];
      if (
        locale !== defaultLocale &&
        !areEqual(value, perLocaleValues[defaultLocale])
      ) {
        output += `locale === "${locale}" ? ${getTranslationValueOutput(value, functionBodyOpts)} : `;
      }
    }
  }

  output += getTranslationValueOutput(
    perLocaleValues[defaultLocale],
    functionBodyOpts,
  );

  return output;
}

const importsMap = {
  types: getImportTypes(),
  i18nInterpolateParams: new ImportsCompiler({
    path: "@koine/i18n",
    named: [{ name: "i18nInterpolateParams" }],
  }),
  i18nInterpolateParamsDeep: new ImportsCompiler({
    path: "@koine/i18n",
    named: [{ name: "i18nInterpolateParamsDeep" }],
  }),
  i18nPluralise: new ImportsCompiler({
    path: "@koine/i18n",
    named: [{ name: "i18nPluralise" }],
  }),
};

const getTFunctions = (
  translations: I18nCompiler.DataTranslations,
  options: Pick<I18nCompiler.Config, "defaultLocale" | "single">,
) => {
  const functions: FunctionsCompiler[] = [];
  const allImports: Set<ImportsCompiler> = new Set();

  allImports.add(importsMap.types);

  for (const translationId in translations) {
    const translation = translations[translationId];
    const { imports, args, body } = getTFunction(translation, options);

    imports.forEach((imp) => allImports.add(imp));

    functions.push(
      new FunctionsCompiler({
        imports,
        name: translation.fnName,
        args,
        body,
        // implicitReturn: true,
        comment: {
          tags: [
            {
              key: "trace",
              val: `\`${translation.trace}\``,
            },
            // no need for this anymore as we have `as const` on the return value
            // {
            //   key: "i18nDefaultValue",
            //   val: `\`${JSON.stringify(translation.values[defaultLocale])}\``,
            // },
          ],
        },
      }),
    );
  }

  return { functions, allImports };
};

export default createGenerator("js", (data) => {
  const {
    config,
    options: {
      translations: optionsTranslations,
      adapter: { modularize },
    },
    translations,
  } = data;
  const { dir } = optionsTranslations.functions;
  const { functions, allImports } = getTFunctions(translations, config);

  return modularize
    ? (functions.reduce((map, fn) => {
        map[fn.name] = {
          dir,
          name: fn.name,
          ext: "ts",
          index: true,
          content: () => {
            return fn.$out("ts", {
              imports: { folderUp: 1 },
              exports: "both",
              style: "function",
              comments: true,
              pure: true,
            });
          },
        };
        return map;
        // NOTE: `as never` so that we don't get a common string in the union of the generated files' ids
      }, {} as I18nCompiler.AdapterGeneratorResult) as never)
    : {
        $t: {
          name: dir,
          ext: "ts",
          index: false,
          content: () => {
            let output = "";
            output += ImportsCompiler.outMany("ts", allImports);
            output += FunctionsCompiler.outMany("ts", functions, {
              imports: false,
              exports: "named",
              style: "function",
              comments: true,
              pure: true,
            });

            return output;
          },
        },
      };
});

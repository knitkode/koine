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
import {
  GLOBAL_I18N_IDENTIFIER,
  compileDataParamsToType,
} from "../../compiler/helpers";
import { ImportsCompiler } from "../../compiler/imports";
import type { I18nCompiler } from "../../compiler/types";
import { getImportTypes } from "./types";

export function getTFunction(
  translation: I18nCompiler.DataTranslation,
  options: Pick<I18nCompiler.Config, "defaultLocale">,
) {
  const { defaultLocale } = options;
  let { values, params, plural, typeValue } = translation;
  const args: FunctionsCompilerDataArg[] = [];
  const pluralCountProperty = "count";

  if (plural) {
    if (params) {
      params = { ...params, [pluralCountProperty]: "number" };
    } else {
      params = { [pluralCountProperty]: "number" };
    }
  }

  if (params) {
    args.push({
      name: "params",
      type: compileDataParamsToType(params),
      optional: false,
    });
  }
  // for ergonomy always allow the user to pass the locale
  args.push({ name: "locale", type: "I18n.Locale", optional: true });
  const imports = [importsMap.types];

  // let body = ""; // with implicitReturn: true
  let body =
    "locale = locale || global." + GLOBAL_I18N_IDENTIFIER + "; return ";
  let returns = "";

  if (isPrimitive(values)) {
    returns += getTranslationValueOutput(values);
  } else {
    returns += getTFunctionBodyWithLocales(defaultLocale, values);
  }
  if (plural) {
    imports.push(importsMap.tPluralise);
    returns = `tPluralise(${returns}, params.${pluralCountProperty})`;
  }

  if (
    params &&
    (!plural ||
      // check that params isn't just about the plural count property, in that
      // case we do not need to interpolate anything, see output in __mocks__
      // where $t_$account_$user$profile_pluralAsObject should not need the
      // presence of `tInterpolateParamsDeep`
      (plural && !Object.keys(params).every((k) => k === pluralCountProperty)))
  ) {
    if (typeValue === "Primitive") {
      imports.push(importsMap.tInterpolateParams);
      returns = `tInterpolateParams(${returns}, params)`;
    } else if (typeValue === "Array" || typeValue === "Object") {
      imports.push(importsMap.tInterpolateParamsDeep);
      returns = `tInterpolateParamsDeep(${returns}, params)`;
    }
  }

  return { body: body + returns, args, imports };
}

function getTranslationValueOutput(value: I18nCompiler.DataTranslationValue) {
  if (isString(value) || isNumber(value)) {
    return `"${value}"`;
  } else if (isBoolean(value)) {
    return `${value}`;
  } else if (isArray(value)) {
    return JSON.stringify(value);
  }
  return `(${JSON.stringify(value)})`;
}

function areEqualTranslationsValues(
  a: I18nCompiler.DataTranslationValue,
  b: I18nCompiler.DataTranslationValue,
) {
  return areEqual(a, b);
}

function getTFunctionBodyWithLocales(
  defaultLocale: I18nCompiler.Config["defaultLocale"],
  perLocaleValues: I18nCompiler.DataTranslation["values"],
) {
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
}

const importsMap = {
  types: getImportTypes(),
  tInterpolateParams: new ImportsCompiler({
    path: "internal/tInterpolateParams",
    named: [{ name: "tInterpolateParams" }],
  }),
  tInterpolateParamsDeep: new ImportsCompiler({
    path: "internal/tInterpolateParamsDeep",
    named: [{ name: "tInterpolateParamsDeep" }],
  }),
  tPluralise: new ImportsCompiler({
    path: "internal/tPluralise",
    named: [{ name: "tPluralise" }],
  }),
};

const getTFunctions = (
  translations: I18nCompiler.DataTranslations,
  options: Pick<I18nCompiler.Config, "defaultLocale">,
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
          title: `translation key \`${translation.fullKey}\``,
          returns: `\`${JSON.stringify(translation.values[options.defaultLocale])}\` (for locale _${options.defaultLocale}_)`,
        },
      }),
    );
  }

  return { functions, allImports };
};

// TODO: check whether adding these annotations change anything:
// /* @__NO_SIDE_EFFECTS__ */
// /*#__PURE__*/
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
            output += ImportsCompiler.outMany("ts", allImports, {
              folderUp: 0,
            });
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

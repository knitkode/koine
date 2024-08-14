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
import { compileDataParamsToType } from "../../compiler/helpers";
import { ImportsCompiler } from "../../compiler/imports";
import type { I18nCompiler } from "../../compiler/types";

// import { tInterpolateParams } from "./tInterpolateParams";
// import { tPluralise } from "./tPluralise";

/**
 * If the user does not specifiy a custom prefix by default we prepend `$t_`
 * when `modularized` option is true
 */
export const getTFunctionsPrefix = (
  data: Pick<I18nCompiler.DataCode<"js">, "options">,
) => {
  const {
    routes: { fnsPrefix },
    adapter: { modularized },
  } = data.options;
  return fnsPrefix || modularized ? "$t_" : "";
};

export const getTranslationValueOutput = (
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

export const areEqualTranslationsValues = (
  a: I18nCompiler.DataTranslationValue,
  b: I18nCompiler.DataTranslationValue,
) => areEqual(a, b);

export const getTFunctionBodyWithLocales = (
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
    // fn: false
  }),
  tInterpolateParams: new ImportsCompiler({
    path: "tInterpolateParams",
    named: [{ name: "tInterpolateParams" }],
    // fn: tInterpolateParams
  }),
  tInterpolateParamsDeep: new ImportsCompiler({
    path: "tInterpolateParamsDeep",
    named: [{ name: "tInterpolateParamsDeep" }],
    // fn: tInterpolateParamsDeep
  }),
  tPluralise: new ImportsCompiler({
    path: "tPluralise",
    named: [{ name: "tPluralise" }],
    // fn: tPluralise
  }),
};

export const getTFunction = (
  translation: I18nCompiler.DataTranslation,
  options: Pick<I18nCompiler.Config, "defaultLocale"> & {
    fnPrefix: string;
  },
) => {
  const { defaultLocale, fnPrefix } = options;
  let { id, values, params, plural, typeValue } = translation;
  const args: FunctionsCompilerDataArg[] = [];
  const name = `${fnPrefix}${id}`;
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

  let body = "";

  if (isPrimitive(values)) {
    body += getTranslationValueOutput(values);
  } else {
    body += getTFunctionBodyWithLocales(defaultLocale, values);
  }
  if (plural) {
    imports.push(importsMap.tPluralise);
    body = `tPluralise(${body}, params.${pluralCountProperty})`;
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
      body = `tInterpolateParams(${body}, params)`;
    } else if (typeValue === "Array" || typeValue === "Object") {
      imports.push(importsMap.tInterpolateParamsDeep);
      body = `tInterpolateParamsDeep(${body}, params)`;
    }
  }

  return { name, body, args, imports };
};

const getTFunctions = (
  translations: I18nCompiler.DataTranslations,
  options: Pick<I18nCompiler.Config, "defaultLocale"> & {
    fnPrefix: string;
  },
) => {
  const functions: FunctionsCompiler[] = [];
  const allImports: Set<ImportsCompiler> = new Set();

  allImports.add(importsMap.types);

  for (const translationId in translations) {
    const { imports, name, args, body } = getTFunction(
      translations[translationId],
      options,
    );

    imports.forEach((imp) => allImports.add(imp));

    functions.push(
      new FunctionsCompiler({
        imports,
        name,
        args,
        body,
        implicitReturn: true,
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
    config: { defaultLocale },
    options: {
      adapter: { modularized },
    },
    translations,
  } = data;
  const fnPrefix = getTFunctionsPrefix(data);
  const { functions, allImports } = getTFunctions(translations, {
    defaultLocale,
    fnPrefix,
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

import { isPrimitive, isString } from "@koine/utils";
import { formatTo } from "../../adapter-js/generators/formatTo";
import {
  getFunctionBodyWithLocales,
  getTranslationValueOutput,
} from "../../adapter-js/generators/t";
import { tInterpolateParams } from "../../adapter-js/generators/tInterpolateParams";
import { tPluralise } from "../../adapter-js/generators/tPluralise";
import { createGenerator } from "../../compiler/createAdapter";
import type { I18nCompiler } from "../../compiler/types";

const getToLookup = (
  routes: I18nCompiler.DataRoutes,
  options: {
    locales: string[];
    defaultLocale: string;
  },
) => {
  const { defaultLocale, locales } = options;
  const lines = [];
  const hasOneLocale = locales.length === 1;

  for (const routeId in routes.byId) {
    let body = "";
    const { pathnames, params } = routes.byId[routeId];

    const args: string[] = [];
    if (params) {
      args.push("params");
    }
    // for ergonomy always allow the user to pass the locale
    args.push("locale");

    const formatArgLocale = hasOneLocale ? `""` : "locale";
    const formatArgParams = params ? ", params" : "";

    if (isString(pathnames)) {
      body += `formatTo(${formatArgLocale}, "${pathnames}"${formatArgParams});`;
    } else {
      body += `formatTo(${formatArgLocale}, ${getFunctionBodyWithLocales(
        defaultLocale,
        pathnames,
      )}${formatArgParams});`;
    }

    lines.push(`"${routeId}": (${args.join(", ")}) => ${body}`);
  }

  return lines.join(",\n  ");
};

const getTLookup = (
  translations: I18nCompiler.DataTranslations,
  options: {
    defaultLocale: string;
    namespaceDelimiter: string;
  },
) => {
  const { defaultLocale, namespaceDelimiter } = options;
  const lines = [];

  for (const translationId in translations) {
    let { namespace, path, values, params, plural } =
      translations[translationId];

    if (plural) {
      if (params) {
        params["count"] = "number";
      } else {
        params = { count: "number" };
      }
    }
    const args: string[] = [];
    if (params) {
      args.push("params");
    }

    let body = "";

    if (isPrimitive(values)) {
      body += getTranslationValueOutput(values);
    } else {
      body += getFunctionBodyWithLocales(defaultLocale, values);
    }
    if (plural) {
      body = `tPluralise(${body}, params.count)`;
    }
    if (params) {
      body = `tInterpolateParams(${body}, params)`;
    }

    lines.push(
      `"${namespace}${namespaceDelimiter}${path}": (${args.join(", ")}) => ${body}`,
    );
  }

  return lines.join(",\n  ");
};

export default createGenerator("next", (arg) => {
  const { config, options, routes, translations } = arg;
  const { defaultLocale, locales } = config;
  const { namespaceDelimiter, dynamicDelimiters } = options.translations.tokens;
  const { globalName } = options.adapter;
  const { cwd, output } = options.write || { cwd: "", output: "" };

  return {
    webpackGlobalDefinition: {
      dir: createGenerator.dirs.internal,
      name: "i18n-globals",
      ext: "d.ts",
      index: false,
      content: () => {
        return `
export {};

declare global {
  // type I18n = import("./types").I18n;

  /**
   * Global t function it allows to select any of the all available
   * strings in _all_ namespaces.
   */
  type GlobalT = <
    TPath extends import("./types").I18n.TranslationsAllPaths,
    TReturn = import("./types").I18n.TranslationAtPath<TPath>,
  >(
    path: TPath,
    query?: object,
  ) => TReturn;

  /**
   * Global to function it allows to select any of the all available routes
   */
  type GlobalTo<Id extends import("./types").I18n.RouteId> = (
    id: Id,
    ...args: Id extends import("./types").I18n.RouteIdDynamic
      ?
          | [import("./types").I18n.RouteParams[Id]]
          | [import("./types").I18n.RouteParams[Id], I18n.Locale]
      : [] | [I18n.Locale]
  ) => import("./types").I18n.RoutePathnames[Id];

  var ${globalName}: {
    t: GlobalT;
    to: GlobalTo;
  }
}
`;
      },
    },
    /**
     * @see
     * - [DefinePlugin / add support for watch mode](https://github.com/webpack/webpack/issues/7717)
     * - [support expressionMemberChain in DefinePlugin](https://github.com/webpack/webpack/pull/15562)
     */
    webpackDefine: {
      dir: createGenerator.dirs.internal,
      name: "webpack-define",
      ext: "js",
      index: false,
      content: () => {
        return /* j s */ `
module.exports = {
  [${globalName}]: DefinePlugin.runtimeValue(
    (_ctx) => {
      return {
        to: \`(function(routeId, params) {
          const locale = global.__i18n_locale;

          ${formatTo(config).$out("cjs", {
            exports: false,
            imports: false,
            comments: false,
          })}

          const lookup = {
            ${getToLookup(routes, { defaultLocale, locales })}
          };

          const fn = lookup[routeId];
          if (fn) return fn(params);

          return "missing: " + routeId;
        })\`,
        t: \`(function(i18nKey, params) {
          const locale = global.__i18n_locale;

          ${tPluralise().$out("cjs", {
            exports: false,
            imports: false,
            comments: false,
          })}

          ${tInterpolateParams(dynamicDelimiters).$out("cjs", {
            exports: false,
            imports: false,
            comments: false,
          })}

          const lookup = {
            ${getTLookup(translations, { defaultLocale, namespaceDelimiter })}
          };

          const fn = lookup[i18nKey];
          if (fn) return fn(params);

          return "missing: " + i18nKey;
        })\`,
      }
    },
    // _runtimeValueOptions:
    {
      fileDependencies: [
        join("${cwd}", "${output}", "internal/webpack-define.js"),
      ],
    },
  ),
};
`;
      },
    },
    //     webpackDefineT: {
    //       name: "webpack-define-t",
    //       ext: "js",
    //       index: false,
    //       content: () => {
    //         // const { functions } = getTFunctions(translations, {
    //         //   defaultLocale,
    //         //   fnPrefix: "",
    //         // });

    //         // ${FunctionsCompiler.outMany("cjs", functions, {
    //         //   imports: false,
    //         //   exports: false,
    //         // })}
    //         return /* j s */ `
    // const locale = global.__i18n_locale;

    // ${tPluralise().$out("cjs", {
    //   exports: false,
    //   imports: false,
    //   comments: false,
    // })}

    // ${tInterpolateParams(dynamicDelimiters).$out("cjs", {
    //   exports: false,
    //   imports: false,
    //   comments: false,
    // })}

    // const lookup = {
    //   ${getTLookup(translations, { defaultLocale, namespaceDelimiter })}
    // };

    // module.exports = (i18nKey, params) => {
    //   const fn = lookup[i18nKey];
    //   if (fn) return fn(params);

    //   return "Unexisting translation key!";
    // };
    // `;
    //       },
    //     },
  };
});

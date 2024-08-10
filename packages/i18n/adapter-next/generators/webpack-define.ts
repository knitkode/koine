import { isPrimitive, isString } from "@koine/utils";
import { formatTo } from "../../adapter-js/generators/formatTo";
import {
  getTFunctionBodyWithLocales,
  getTranslationValueOutput,
} from "../../adapter-js/generators/t";
import { tInterpolateParams } from "../../adapter-js/generators/tInterpolateParams";
import { tPluralise } from "../../adapter-js/generators/tPluralise";
import { getToFunctionBodyWithLocales } from "../../adapter-js/generators/to";
import { createGenerator } from "../../compiler/createAdapter";
import { GLOBAL_I18N_IDENTIFIER } from "../../compiler/helpers";
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
      body += `formatTo(${formatArgLocale}, "${pathnames}"${formatArgParams})`;
    } else {
      body += `formatTo(${formatArgLocale}, ${getToFunctionBodyWithLocales(
        defaultLocale,
        pathnames,
      )}${formatArgParams})`;
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
      body += getTFunctionBodyWithLocales(defaultLocale, values);
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

const getGlobalToType = (routes: I18nCompiler.DataRoutes) => {
  const { dynamicRoutes, staticRoutes } = routes;
  const I18n = `import("../types").I18n`;
  let out = `
  /**
   * Global to function (allows to select any of the all available routes)
   */
  type GlobalTo = <Id extends ${I18n}.RouteId>(`;

  if (dynamicRoutes.length && staticRoutes.length) {
    out += `
      id: Id,
      ...args: Id extends ${I18n}.RouteIdDynamic
        ?
            | [${I18n}.RouteParams[Id]]
            | [${I18n}.RouteParams[Id], ${I18n}.Locale]
        : [] | [${I18n}.Locale]
    ) => ${I18n}.RoutePathnames[Id];`;
  } else if (dynamicRoutes.length) {
    out += `
    id: Id,
    ...args:
      | [${I18n}.RouteParams[Id]]
      | [${I18n}.RouteParams[Id], ${I18n}.Locale]
  ) => ${I18n}.RoutePathnames[Id];`;
  } else {
    out += `
    id: Id,
    locale?: ${I18n}.Locale
  ) => ${I18n}.RoutePathnames[Id];`;
  }

  return out;
};

export default createGenerator("next", (arg) => {
  const { config, options, routes, translations } = arg;
  const { defaultLocale, locales, debug } = config;
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

  /**
   * Global t function (allows to select any of the all available translations)
   *
   * @param path e.g. \`"myNamespace${namespaceDelimiter}myPath.nestedKey"\`
   */
  type GlobalT = <
    TPath extends import("../types").I18n.TranslationsAllPaths,
    TReturn = import("../types").I18n.TranslationAtPath<TPath>,
  >(
    path: TPath,
    query?: object,
  ) => TReturn;
  ${getGlobalToType(routes)}

  var ${globalName}: {
    t: GlobalT;
    to: GlobalTo;
  }
}
`;
      },
    },
    /**
     * Some useful webpack DefinePlugin context (`ctx`) object properties
     * - `ctx.module.layer` one of `"ssr"` | `"rsc"` | `"app-pages-browser"` | ?
     * - `ctx.module.buildInfo.rsc`
     * - `ctx.module.resourceResolveData.context`
     *
     * @see
     * - [DefinePlugin / add support for watch mode](https://github.com/webpack/webpack/issues/7717)
     * - [support expressionMemberChain in DefinePlugin](https://github.com/webpack/webpack/pull/15562)
     *
     * NOTE: `DefinePlugin.runtimeValue` according to webpack types should return
     * a `CodeValuePrimitive` (aka a string usually) type but returning an object
     * also works and allows for a nicer namespaced global api. TODO: Verify that
     * returning an object here is intentionally supportedas unknown as string;
     */
    webpackDefine: {
      dir: createGenerator.dirs.internal,
      name: "webpack-define",
      ext: "js",
      index: false,
      content: () => {
        return /* j s */ `
const { join } = require("path");
const { DefinePlugin } = require("webpack");

module.exports = {
  ${globalName}: DefinePlugin.runtimeValue(
    (_ctx) => {
      ${debug === "internal" ? `console.log("[@koine/i18n]:webpack-define:ctx.module", _ctx.module);` : ``};
      return {
        to: \`(function(routeId, params) {
          const locale = global.${GLOBAL_I18N_IDENTIFIER};
          ${debug === "internal" ? `console.log("[@koine/i18n]:webpack-define:to", { locale });` : ``};

          const defaultLocale = "${defaultLocale}";

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
          const locale = global.${GLOBAL_I18N_IDENTIFIER};
          ${debug === "internal" ? `console.log("[@koine/i18n]:webpack-define:t", { locale });` : ``};

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
  };
});

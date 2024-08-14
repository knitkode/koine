import { formatTo } from "../../adapter-js/generators/formatTo";
import {
  getTFunction,
  getTFunctionsPrefix,
} from "../../adapter-js/generators/t";
import { tInterpolateParams } from "../../adapter-js/generators/tInterpolateParams";
import { tInterpolateParamsDeep } from "../../adapter-js/generators/tInterpolateParamsDeep";
import { tPluralise } from "../../adapter-js/generators/tPluralise";
import {
  getToFunction,
  getToFunctionsPrefix,
} from "../../adapter-js/generators/to";
import { createGenerator } from "../../compiler/createAdapter";
import {
  GLOBAL_I18N_IDENTIFIER,
  compileDataParamsToType,
} from "../../compiler/helpers";

function collapseWhitespaces(input: string) {
  return input.replace(/\s+/g, " ");
}

// prettier-ignore
export default createGenerator("next", (arg) => {
  const { config, options, routes, translations } = arg;
  const { defaultLocale, debug } = config;
  const { namespaceDelimiter, dynamicDelimiters } = options.translations.tokens;
  const { globalName } = options.adapter;
  const { cwd, output } = options.write || { cwd: "", output: "" };
  const tFnPrefix = getTFunctionsPrefix({
    translations: arg.options.translations,
    modularized: arg.options.adapter.modularized,
  });
  const toFnPrefix = getToFunctionsPrefix({
    routes: arg.options.routes,
    modularized: arg.options.adapter.modularized,
  });

  return {
    webpackDefineGranularTypes: {
      dir: createGenerator.dirs.internal,
      name: "webpack-define-granular-types",
      ext: "d.ts",
      index: false,
      content: () => {
        const I18n = `import("../types").I18n`;

        return `
export {};

declare global {
  var ${globalName}: {
    ${Object.keys(translations)
      .map((translationId) => {
        const translation = translations[translationId];
        const { namespace, path, params } = translation;
        const { name } = getTFunction(translation, {
          ...config,
          fnPrefix: tFnPrefix
        })
        let out = `${name}: (`;
        params
          ? (out += `params: ${compileDataParamsToType(params)}, `)
          : (out += ``);

        out += `locale?: ${I18n}.Locale) => ${I18n}.TranslationAtPath<"${namespace}${arg.options.translations.tokens.namespaceDelimiter}${path}">`;
        return out;
      })
      .join(";\n    ")},
    ${Object.keys(routes.byId)
      .map((routeId) => {
        const route = routes.byId[routeId];
        const { id, params } = route;
        const { name } = getToFunction(route, {
          ...config,
          fnPrefix: toFnPrefix,
        });
        let out = `${name}: (`;
        params
          ? (out += `params: ${compileDataParamsToType(params)}, `)
          : (out += ``);

        out += `locale?: ${I18n}.Locale) => ${I18n}.RoutePathnames["${id}"]`;
        return out;
      })
      .join(";\n    ")},
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
    webpackDefineGranular: {
      dir: createGenerator.dirs.internal,
      name: "webpack-define-granular",
      ext: "js",
      index: false,
      content: () => {
        return /* j s */ `
const { DefinePlugin } = require("webpack");

module.exports = {
  ${globalName}: DefinePlugin.runtimeValue(
    (_ctx) => {
      return {
        ${Object.keys(routes.byId)
          .map((routeId) => {
            const { name, body } = getToFunction(routes.byId[routeId], {
              ...config,
              fnPrefix: toFnPrefix,
            });
            return (
              `"i18n.${name}": ` +
              collapseWhitespaces(
                [
                  "`(function(params, locale) {",
                  "locale = locale || global." + GLOBAL_I18N_IDENTIFIER + ";",
                  formatTo(config).$outInline(),
                  "return " + body,
                  "})`",
                ].join(" "),
              )
            );
          })
          .join(",\n        ")},
        ${Object.keys(translations)
          .map((translationId) => {
            const translation = translations[translationId];
            const { name, args, body } = getTFunction(translation, {
              ...config,
              fnPrefix: tFnPrefix,
            });
            return (
              `"i18n.${name}": ` +
              collapseWhitespaces(
                [
                  "`(function(" + args.map(a => a.name).join(", ") + ") {",
                  "locale = locale || global." + GLOBAL_I18N_IDENTIFIER + ";",
                  translation.params ? tInterpolateParams(arg.options.translations.tokens.dynamicDelimiters).$outInline() : "",
                  translation.typeValue === "Primitive" ? "" : tInterpolateParamsDeep().$outInline(),
                  translation.plural ? tPluralise().$outInline() : "",
                  "return " + body,
                  "})`",
                ].join(" "),
              )
            );
          })
          .join(",\n        ")},
      };
    }
  ),
};
`;
      },
    },
    webpackDefineCompactTypes: {
      disabled: true,
      dir: createGenerator.dirs.internal,
      name: "webpack-define-compact-types",
      ext: "d.ts",
      index: false,
      content: () => {
        const { dynamicRoutes, staticRoutes } = routes;
        const I18n = `import("../types").I18n`;
        let GlobalTo = `
  type GlobalTo = <Id extends ${I18n}.RouteId>(`;

  if (dynamicRoutes.length && staticRoutes.length) {
    GlobalTo += `
      id: Id,
      ...args: Id extends ${I18n}.RouteIdDynamic
        ?
            | [${I18n}.RouteParams[Id]]
            | [${I18n}.RouteParams[Id], ${I18n}.Locale]
        : [] | [${I18n}.Locale]
    ) => ${I18n}.RoutePathnames[Id];`;
  } else if (dynamicRoutes.length) {
    GlobalTo += `
    id: Id,
    ...args:
      | [${I18n}.RouteParams[Id]]
      | [${I18n}.RouteParams[Id], ${I18n}.Locale]
  ) => ${I18n}.RoutePathnames[Id];`;
  } else {
    GlobalTo += `
    id: Id,
    locale?: ${I18n}.Locale
  ) => ${I18n}.RoutePathnames[Id];`;
        }

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

  /**
   * Global to function (allows to select any of the all available routes)
   */
  ${GlobalTo}

  var ${globalName}: {
    t: GlobalT;
    to: GlobalTo;
  }
}
`;
      },
    },
    webpackDefineCompact: {
      disabled: true,
      dir: createGenerator.dirs.internal,
      name: "webpack-define-compact",
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
          ${debug === "internal" ? `console.log("[@koine/i18n]:webpack-define-compact:to", { locale });` : ``}

          const defaultLocale = "${defaultLocale}";

          ${formatTo(config).$out("cjs", {
            exports: false,
            imports: false,
            comments: false,
          })}

          const lookup = {
            ${Object.keys(routes.byId)
              .map((routeId) => {
                const { args, body } = getToFunction(routes.byId[routeId], {
                  ...config,
                  fnPrefix: toFnPrefix,
                });
                return `"${routeId}": (${args.map((a) => a.name === "locale" ? "locale = locale" : a.name).join(", ")}) => ${body}`;
              })
              .join(",\n  ")}
          };

          const fn = lookup[routeId];
          if (fn) return fn(params);

          return "missing: " + routeId;
        })\`,
        t: \`(function(i18nKey, params) {
          const locale = global.${GLOBAL_I18N_IDENTIFIER};
          ${debug === "internal" ? `console.log("[@koine/i18n]:webpack-define-compact:t", { locale });` : ``}

          ${tPluralise().$outInline()}
          ${tInterpolateParams(dynamicDelimiters).$outInline()}
          ${tInterpolateParamsDeep().$outInline()}

          const lookup = {
            ${Object.keys(translations)
              .map((translationId) => {
                const { namespace, path } = translations[translationId];
                const { args, body } = getTFunction(translations[translationId], {
                  ...config,
                  fnPrefix: tFnPrefix,
                });
                return `"${namespace}${arg.options.translations.tokens.namespaceDelimiter}${path}": (${args.map((a) => a.name === "locale" ? "locale = locale" : a.name).join(", ")}) => ${body}`;
              })
              .join(",\n  ")}
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

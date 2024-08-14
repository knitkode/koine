import { isPrimitive } from "@koine/utils";
import { formatTo } from "../../adapter-js/generators/formatTo";
import {
  getTFunctionBodyWithLocales,
  getTranslationValueOutput,
} from "../../adapter-js/generators/t";
import { tInterpolateParams } from "../../adapter-js/generators/tInterpolateParams";
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
import type { I18nCompiler } from "../../compiler/types";

function collapseWhitespaces(input: string) {
  return input.replace(/\s+/g, " ");
}

const getTLookup = (
  translations: I18nCompiler.DataTranslations,
  options: Pick<I18nCompiler.Config, "defaultLocale"> & {
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
        params = { ...params, count: "number" };
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
  const { defaultLocale, debug } = config;
  const { namespaceDelimiter, dynamicDelimiters } = options.translations.tokens;
  const { globalName } = options.adapter;
  const { cwd, output } = options.write || { cwd: "", output: "" };
  const toFnPrefix = getToFunctionsPrefix({
    routes: arg.options.routes,
    modularized: arg.options.adapter.modularized,
  });

  return {
    webpackGlobalDefinitionGranular: {
      dir: createGenerator.dirs.internal,
      name: "i18n-globals",
      ext: "d.ts",
      index: false,
      content: () => {
        const I18n = `import("../types").I18n`;

        return `
export {};

declare global {

  /**
   * Global t function (allows to select any of the all available translations)
   *
   * @param path e.g. \`"myNamespace${namespaceDelimiter}myPath.nestedKey"\`
   */
  type GlobalT = <TPath extends import("../types").I18n.TranslationsAllPaths>(
    path: TPath,
    query?: object,
  ) => import("../types").I18n.TranslationAtPath<TPath>;

  var ${globalName}: {
    t: GlobalT;
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
                  "`(function(params, customLocale) {",
                  "const locale = customLocale || global." +
                    GLOBAL_I18N_IDENTIFIER +
                    ";",
                  formatTo(config).$out("cjs", {
                    exports: false,
                    imports: false,
                    comments: false,
                  }),
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
      //       content: () => {
      //         return /* j s */ `
      // const { join } = require("path");
      // const { DefinePlugin } = require("webpack");

      // module.exports = {
      //   ${globalName}: DefinePlugin.runtimeValue(
      //     (_ctx) => {
      //       return {
      //         ${Object.keys(routes).map((routeId) => {
      //           const { name, args, body } = getToFunction(routes.byId[routeId], {
      //               ...config,
      //             fnPrefix: toFnPrefix
      //           });
      //           return `` +
      //         `${name}: DefinePlugin.runtimeValue(
      //           (_ctx) => {
      //             const locale = global.${GLOBAL_I18N_IDENTIFIER};
      //             const defaultLocale = "${defaultLocale}";

      //             ${formatTo(config).$out("cjs", {
      //               exports: false,
      //               imports: false,
      //               comments: false,
      //             })}
      //             return (${args.map((a) => a.name).join(", ")}) => ${body};
      //           },
      //           {
      //             fileDependencies: [
      //               join("${cwd}", "${output}", "internal/webpack-define.js"),
      //             ],
      //           },
      //         )`;
      //         }).join(",        \n")},
      //       };
      //     }
      //   ),
      // };
      // `;
      //       },
    },
    webpackGlobalDefinitionCompact: {
      disabled: true,
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
          ${debug === "internal" ? `console.log("[@koine/i18n]:webpack-define-compact:to", { locale });` : ``};

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
                return `"${routeId}": (${args.map((a) => a.name).join(", ")}) => ${body}`;
              })
              .join(",\n  ")}
          };

          const fn = lookup[routeId];
          if (fn) return fn(params);

          return "missing: " + routeId;
        })\`,
        t: \`(function(i18nKey, params) {
          const locale = global.${GLOBAL_I18N_IDENTIFIER};
          ${debug === "internal" ? `console.log("[@koine/i18n]:webpack-define-compact:t", { locale });` : ``};

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

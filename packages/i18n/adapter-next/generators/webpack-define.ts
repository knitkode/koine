import { formatTo } from "../../adapter-js/generators/formatTo";
import {
  i18nInterpolateParamsCompiler,
  i18nInterpolateParamsDeepCompiler,
} from "../../adapter-js/generators/interpolate";
import { getTFunction } from "../../adapter-js/generators/t";
import { tPluralise } from "../../adapter-js/generators/tPluralise";
import { getToFunction } from "../../adapter-js/generators/to";
import { getTypeLocale } from "../../adapter-js/generators/types";
import { createGenerator } from "../../compiler/createAdapter";
import {
  GLOBAL_I18N_IDENTIFIER,
  compileDataParamsToType,
} from "../../compiler/helpers";
import { resolveGlobalizeOption } from "../index";

function collapseWhitespaces(input: string) {
  return input.replace(/\s+/g, " ");
}

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
// prettier-ignore
export default createGenerator("next", (arg) => {
  const { config, options } = arg;
  const { debug } = config;
  const { cwd, output } = options.write || { cwd: "", output: "" };
  const { modularize } = options.adapter.options;
  const globalize = resolveGlobalizeOption(options.adapter.options.globalize);
  const routesToGlobalize = globalize.functions.routes ? arg.routes.byId : {};
  const translationsToGlobalize = globalize.functions.translations ? arg.translations : {};

  return {
    webpackDefineGranularTypes: {
      dir: createGenerator.dirs.internal,
      name: "webpack-define-granular-types",
      ext: "d.ts",
      index: false,
      content: () => {
        // const I18n = `import("../types").I18n`;
        // const Locale = `${I18n}.Locale`;
        /** a.k.a. `I18n.Locale`, inlined for better visualization on hover in IDE */
        const Locale = getTypeLocale(config);

        return `
export {};

declare global {
  ${Object.keys(routesToGlobalize)
    .map((key) => {
      const route = routesToGlobalize[key];
      const { fnName, params, pathnames } = route;
      let out = `var ${globalize.prefixSafe}${fnName}: (`;
      params
        ? (out += `params: ${compileDataParamsToType(params)}, `)
        : (out += ``);

      // out += `locale?: ${Locale}) => ${I18n}.RoutePathnames["${id}"]`;
      out += `locale?: ${Locale}) => ${JSON.stringify(pathnames[config.defaultLocale])}`;
      return out;
    })
    .join(";\n  ")};
  ${Object.keys(translationsToGlobalize)
    .map((key) => {
      const translation = translationsToGlobalize[key];
      const { fnName, params, values } = translation;
      let out = `var ${globalize.prefixSafe}${fnName}: (`;
      params
        ? (out += `params: ${compileDataParamsToType(params)}, `)
        : (out += ``);

      // use of more advanced types to extract the value from the dictionary
      // out += `locale?: ${Locale}) => ${I18n}.TranslationAt<"${trace}">`;
      // use of a hardcoded return type nice to read when overing the function in the IDE
      out += `locale?: ${Locale}) => ${JSON.stringify(values[config.defaultLocale])}`;
      return out;
    })
    .join(";\n  ")};
}
`;
      },
    },
    webpackDefineGranular: {
      dir: createGenerator.dirs.internal,
      name: "webpack-define-granular",
      ext: "cjs",
      index: false,
      content: () => {
        return /* j s */ `
const { join } = require("path");
const { DefinePlugin } = require("webpack");

const base = join("${cwd}", "${output}");

module.exports = {
  ${Object.keys(routesToGlobalize)
    .map((key) => {
      const route = routesToGlobalize[key];
      const { fnName } = route;
      const { args, body } = getToFunction(route, config);
      const { dir } = options.routes.functions;
      return (
        `${globalize.prefixSafe}${fnName}: DefinePlugin.runtimeValue(() => ` +
        collapseWhitespaces(
          [
            "`(function(" + args.map(a => a.name).join(", ") + ") {",
              formatTo(config).$outInline(),
              body({ format: "cjs" }),
            "})`,",
            `{ fileDependencies: [join(base, ${modularize ? `"${dir}", "${fnName}.ts"` : `"${dir}.ts"`})] }`
          ].join(" ")
        )
      );
    }).join("),\n  ")}),
  ${Object.keys(translationsToGlobalize)
    .map((key) => {
      const translation = translationsToGlobalize[key];
      const { fnName, params, typeValue, plural } = translation;
      const { args, body } = getTFunction(translation, config);
      const { dir } = options.translations.functions;
      return (
        `${globalize.prefixSafe}${fnName}: DefinePlugin.runtimeValue(() => ` +
        collapseWhitespaces(
          [
            "`(function(" + args.map(a => a.name).join(", ") + ") {",
              params ? i18nInterpolateParamsCompiler(options.translations.tokens.dynamicDelimiters).$outInline() : "",
              params ? (typeValue === "Primitive" ? "" : i18nInterpolateParamsDeepCompiler().$outInline()) : "",
              plural ? tPluralise().$outInline() : "",
              body({ format: "cjs" }),
            "})`,",
            `{ fileDependencies: [join(base, ${modularize ? `"${dir}", "${fnName}.ts"` : `"${dir}.ts"`})] }`
          ].join(" ")
        )
      );
    }).join(`),\n  `)}),
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
        // TODO: here split in the two groups routesToGlobalize rather than arg.routes
        const { dynamicRoutes, staticRoutes } = arg.routes;
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
   * @param path e.g. \`"myNamespace${options.translations.tokens.namespaceDelimiter}myPath.nestedKey"\`
   */
  type GlobalT = <
    TTrace extends import("../types").I18n.TranslationsTrace,
    TReturn = import("../types").I18n.TranslationAt<TTrace>,
  >(
    trace: TTrace,
    query?: object,
  ) => TReturn;

  /**
   * Global to function (allows to select any of the all available routes)
   */
  ${GlobalTo}

  var ${globalize.prefix}: {
    t: GlobalT;
    to: GlobalTo;
  };
}
`;
      },
    },
    webpackDefineCompact: {
      disabled: true,
      dir: createGenerator.dirs.internal,
      name: "webpack-define-compact",
      ext: "cjs",
      index: false,
      content: () => {
        return /* j s */ `
const { join } = require("path");
const { DefinePlugin } = require("webpack");

module.exports = {
  ${globalize.prefix}: DefinePlugin.runtimeValue(
    (_ctx) => {
      ${debug === "internal" ? `console.log("[@koine/i18n]:webpack-define:ctx.module", _ctx.module);` : ``};
      return {
        to: \`(function(routeId, params) {
          const locale = globalThis.${GLOBAL_I18N_IDENTIFIER};
          ${debug === "internal" ? `console.log("[@koine/i18n]:webpack-define-compact:to", { locale });` : ``}

          const defaultLocale = "${config.defaultLocale}";

          ${formatTo(config).$out("cjs", {
            exports: false,
            imports: false,
            comments: false,
          })}

          const lookup = {
            ${Object.keys(routesToGlobalize)
              .map((key) => {
                const route = routesToGlobalize[key];
                const { args, body } = getToFunction(route, config);
                return `"${key}": (${args.map((a) => a.name).join(", ")}) => { ${body({ format: "cjs" })} }`;
              })
              .join(",\n  ")}
          };

          const fn = lookup[routeId];
          if (fn) return fn(params);

          return "missing: " + routeId;
        })\`,
        t: \`(function(trace, params) {
          const locale = globalThis.${GLOBAL_I18N_IDENTIFIER};
          ${debug === "internal" ? `console.log("[@koine/i18n]:webpack-define-compact:t", { locale });` : ``}

          ${tPluralise().$outInline()}
          ${i18nInterpolateParamsCompiler(options.translations.tokens.dynamicDelimiters).$outInline()}
          ${i18nInterpolateParamsDeepCompiler().$outInline()}

          const lookup = {
            ${Object.keys(translationsToGlobalize)
              .map((key) => {
                const translation = translationsToGlobalize[key];
                const { trace } = translation;
                const { args, body } = getTFunction(translation, config);
                return `"${trace}": (${args.map((a) => a.name).join(", ")}) => { ${body({ format: "cjs" })} }`;
              })
              .join(",\n  ")}
          };

          const fn = lookup[trace];
          if (fn) return fn(params);

          return "missing: " + trace;
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

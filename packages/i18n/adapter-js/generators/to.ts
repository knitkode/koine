import { isString } from "@koine/utils";
import { createGenerator } from "../../compiler/createAdapter";
import {
  FunctionsCompiler,
  type FunctionsCompilerDataArg,
} from "../../compiler/functions";
import { GLOBAL_I18N_IDENTIFIER } from "../../compiler/helpers";
import { ImportsCompiler } from "../../compiler/imports";
import type { I18nCompiler } from "../../compiler/types";
import { getImportTypes } from "./types";

export function getToFunction(
  route: I18nCompiler.DataRoute,
  options: Pick<I18nCompiler.Config, "defaultLocale" | "single">,
) {
  const { id, params } = route;
  const body = getToFunctionBody(route, options);
  const args: FunctionsCompilerDataArg[] = [];

  if (params) {
    args.push({
      name: "params",
      type: `I18n.RouteParams["${id}"]`,
      optional: false,
      description: "Dynamic values to interpolate in the output URL pathname",
    });
  }
  // for ergonomy always allow the user to pass the locale
  args.push({
    name: "locale",
    type: "I18n.Locale",
    optional: true,
    description: "Use this to override the current locale",
    defaults: "current locale",
  });

  return { body, args };
}

function getToFunctionBody(
  route: I18nCompiler.DataRoute,
  options: Pick<I18nCompiler.Config, "defaultLocale" | "single">,
) {
  const { params, pathnames, equalValues } = route;
  const { defaultLocale, single } = options;
  const hasValuableLocalisation = !single && !equalValues;
  const formatArgLocale = single ? `""` : "locale";
  const formatArgParams = params ? ", params" : "";

  // let body = ""; // with implicitReturn: true
  let body = hasValuableLocalisation
    ? "locale = locale || global." + GLOBAL_I18N_IDENTIFIER + "; "
    : "";
  body += "return ";

  let returns = "";

  if (isString(pathnames)) {
    returns += `formatTo(${formatArgLocale}, "${pathnames}"${formatArgParams})`;
  } else {
    returns += `formatTo(${formatArgLocale}, ${getToFunctionBodyWithLocales(
      defaultLocale,
      pathnames,
    )}${formatArgParams})`;
  }
  return body + returns;
}

function getToFunctionBodyWithLocales(
  defaultLocale: string,
  perLocaleValues: Record<string, string>,
) {
  let output = "";

  for (const locale in perLocaleValues) {
    const value = perLocaleValues[locale];
    if (locale !== defaultLocale && value !== perLocaleValues[defaultLocale]) {
      output += `locale === "${locale}" ? "${value}" : `;
    }
  }

  output += '"' + perLocaleValues[defaultLocale] + '"';

  return output;
}

const importsMap = {
  formatTo: new ImportsCompiler({
    path: "internal/formatTo",
    named: [{ name: "formatTo" }],
  }),
  types: getImportTypes(),
};

function getToFunctions(
  routes: I18nCompiler.DataRoutes,
  options: Pick<I18nCompiler.Config, "defaultLocale" | "single">,
) {
  const functions: FunctionsCompiler[] = [];
  const allImports = new Set<ImportsCompiler>();

  allImports.add(importsMap.formatTo);
  allImports.add(importsMap.types);

  for (const routeId in routes.byId) {
    const route = routes.byId[routeId];
    const { args, body } = getToFunction(route, options);

    functions.push(
      new FunctionsCompiler({
        imports: [importsMap.formatTo, importsMap.types],
        name: route.fnName,
        args,
        body,
        // implicitReturn: true,
        comment: {
          tags: [
            {
              key: "i18nRouteId",
              val: `\`${routeId}\``,
            },
            {
              key: "i18nDefaultValue", // + defaultLocale,
              val: `\`"${route.pathnames[options.defaultLocale]}"\``,
            },
          ],
        },
      }),
    );
  }

  return { functions, allImports };
}

function $to(
  data: I18nCompiler.DataCode<"js">,
): I18nCompiler.AdapterGeneratorResult {
  const {
    config,
    routes,
    options: {
      routes: optionsRoutes,
      adapter: { modularize },
    },
  } = data;
  const { dir } = optionsRoutes.functions;
  const { functions, allImports } = getToFunctions(routes, config);

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
        $to: {
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
}

export default createGenerator("js", (arg) => {
  const {
    options: {
      routes: {
        tokens: { idDelimiter },
      },
    },
    routes: { dynamicRoutes, staticRoutes },
  } = arg;
  return {
    ...$to(arg),
    to: {
      name: "to",
      ext: "ts",
      index: true,
      content: () => /* j s */ `
import { defaultLocale } from "./defaultLocale";${dynamicRoutes.length && staticRoutes.length ? `\nimport { isLocale } from "./isLocale";` : ``}
import { formatTo } from "./internal/formatTo";
import { routesSlim } from "./internal/routesSlim";
import type { I18n } from "./types";

/**
 * *To* route utility
 * 
 * @returns A localised relative URL based on your i18nCompiler configuration
 */${
   dynamicRoutes.length && staticRoutes.length
     ? `
export function to<Id extends I18n.RouteId>(
  id: Id,
  ...args: Id extends I18n.RouteIdDynamic
    ?
        | [I18n.RouteParams[Id]]
        | [I18n.RouteParams[Id], I18n.Locale]
    : [] | [I18n.Locale]
) {
  const locale = (isLocale(args[0]) ? args[0] : args[1]) || defaultLocale;

  return formatTo(
    locale,
    (routesSlim[id] as Record<string, string>)[locale] ??
      (routesSlim[id] as Record<string, string>)[defaultLocale] ??
      routesSlim[id] as string,
    isLocale(args[0]) ? undefined : args[0]
  ) as I18n.RoutePathnames[Id];
}
`
     : dynamicRoutes.length
       ? `
export function to<Id extends I18n.RouteId>(
  id: Id,
  params: I18n.RouteParams[Id],
  locale = defaultLocale
) {
  return formatTo(
    locale,
    (routesSlim[id] as Record<string, string>)[locale] ??
      (routesSlim[id] as Record<string, string>)[defaultLocale] ??
      routesSlim[id] as string,
    params
  ) as I18n.RoutePathnames[Id];
}
`
       : `
export function to<Id extends I18n.RouteId>(id: Id, locale = defaultLocale) {
  return formatTo(
    locale,
    (routesSlim[id] as Record<string, string>)[locale] ??
      (routesSlim[id] as Record<string, string>)[defaultLocale] ??
      routesSlim[id] as string,
  ) as I18n.RoutePathnames[Id];
}`
 }

export default to;
`,
    },
    toSpa: {
      name: "toSpa",
      ext: "ts",
      index: true,
      disabled: !arg.routes.haveSpaRoutes,
      content: () => /* j s */ `
import { defaultLocale } from "./defaultLocale";
import { formatTo } from "./internal/formatTo";
import { routesSpa } from "./internal/routesSpa";
import { isLocale } from "./isLocale";
import type { I18n } from "./types";

/**
 * *To spa* route utility
 *
 * @returns A localised relative URL based on your i18nCompiler configuration
 */
export function toSpa<
  Root extends keyof I18n.RouteSpa,
  Path extends Extract<keyof I18n.RouteSpa[Root], string>,
>(
  rootId: Root,
  pathId: Path,
  ...args: I18n.RouteJoinedId<Root, Path> extends I18n.RouteIdDynamic
    ?
        | [I18n.RouteParams[I18n.RouteJoinedId<Root, Path>]]
        | [I18n.RouteParams[I18n.RouteJoinedId<Root, Path>], I18n.Locale]
    : [] | [I18n.Locale]
) {
  const locale = (isLocale(args[0]) ? args[0] : args[1]) || defaultLocale;
  const fullId = \`\${rootId}${idDelimiter}\${pathId}\` as I18n.RouteJoinedId<Root, Path>;
  return formatTo(
    // FIXME: actually the locale will be prepended if hideDefaultLocaleInUrl will be false
    "", // do not pass the locale so that won't be prepended
    (routesSpa[fullId] as Record<string, string>)[locale],
    args.length === 2
      ? args[0]
      : args[0] && !isLocale(args[0])
        ? args[0]
        : void 0,
  ) as I18n.RouteSpa[Root][Path];
}

export default toSpa;
`,
    },
  };
});

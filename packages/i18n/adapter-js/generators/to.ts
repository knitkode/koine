import { changeCaseSnake, isString } from "@koine/utils";
import { createGenerator } from "../../compiler/createAdapter";
import {
  FunctionsCompiler,
  type FunctionsCompilerDataArg,
} from "../../compiler/functions";
import { ImportsCompiler } from "../../compiler/imports";
import type { I18nCompiler } from "../../compiler/types";

const getFunctionBodyWithLocales = (
  defaultLocale: string,
  perLocaleValues: Record<string, string>,
) => {
  let output = "";

  for (const locale in perLocaleValues) {
    const value = perLocaleValues[locale];
    if (locale !== defaultLocale && value !== perLocaleValues[defaultLocale]) {
      output += `locale === "${locale}" ? "${value}" : `;
    }
  }

  output += '"' + perLocaleValues[defaultLocale] + '"';

  return output;
};

const importsMap = {
  formatTo: new ImportsCompiler({
    path: "formatTo",
    named: [{ name: "formatTo" }],
  }),
  types: new ImportsCompiler({
    path: "types",
    named: [{ name: "I18n", type: true }],
  }),
  // formatTo: `import { formatTo } from "${dir}formatTo";`,
  // types: `import type { I18n } from "${dir}types";`,
};

const getToFunctions = (
  routes: I18nCompiler.DataRoutes,
  options: {
    defaultLocale: string;
    locales: string[];
    modularized: boolean;
    fnsPrefix: string;
  },
) => {
  const { defaultLocale, locales, modularized, fnsPrefix } = options;
  const functions: FunctionsCompiler[] = [];
  const hasOneLocale = locales.length === 1;
  const allImports = new Set<ImportsCompiler>();
  // if the user does not specifiy a custom prefix by default we prepend `t_`
  // when `modularized` option is true
  const fnPrefix = fnsPrefix || modularized ? "$to_" : "";

  allImports.add(importsMap.formatTo);
  allImports.add(importsMap.types);

  for (const routeId in routes.byId) {
    let body = "";
    const { pathnames, params } = routes.byId[routeId];

    const name = `${fnPrefix}${changeCaseSnake(routeId)}`;
    const paramsType = `I18n.RouteParams["${routeId}"]`;

    const args: FunctionsCompilerDataArg[] = [];
    if (params) {
      args.push({
        name: "params",
        type: paramsType,
        optional: false,
      });
    }
    // for ergonomy always allow the user to pass the locale
    args.push({ name: "locale", type: "I18n.Locale", optional: true });

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

    functions.push(
      new FunctionsCompiler({
        imports: [importsMap.formatTo, importsMap.types],
        name,
        args,
        body,
      }),
    );
  }

  return { functions, fnPrefix, allImports };
};

// TODO: check whether adding /*#__PURE__*/ annotation changes anything
const $to = ({
  config,
  routes,
  options: {
    routes: { fnsPrefix },
    adapter: { modularized },
  },
}: I18nCompiler.DataCode<"js">): I18nCompiler.AdapterGeneratorResult => {
  const { functions, fnPrefix, allImports } = getToFunctions(routes, {
    defaultLocale: config.defaultLocale,
    locales: config.locales,
    fnsPrefix,
    modularized,
  });

  return modularized
    ? (functions.reduce((map, fn) => {
        map[fn.name] = {
          // TODO: weak point: we strip the trailing underscore but the user
          // might defined a different prefix for these functions
          dir: fnPrefix.replace(/_*$/, ""),
          name: fn.name,
          ext: "ts",
          index: true,
          content: () => {
            let output = "";
            output += fn.$out("ts", {
              imports: { folderUp: 1 },
              exports: "both",
            });

            return output;
          },
        };
        return map;
        // NOTE: `as never` so that we don't get a common string in the union of the generated files' ids
      }, {} as I18nCompiler.AdapterGeneratorResult) as never)
    : {
        $to: {
          name: "$to",
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
            // output += `export const $to = {\n  ${functions.map((f) => f.name).join(",\n  ")}\n};`;
            // output += `\n\n`;
            // output += `export default $to;`;

            return output;
          },
        },
      };
};

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
import { formatTo } from "./formatTo";
import { routesSlim } from "./routesSlim";
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
      content: () => /* j s */ `
import { defaultLocale } from "./defaultLocale";
import { formatTo } from "./formatTo";
import { isLocale } from "./isLocale";
import { routesSpa } from "./routesSpa";
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

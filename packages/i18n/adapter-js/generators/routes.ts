import { createGenerator } from "../../compiler/createAdapter";
import type { I18nCompiler } from "../../compiler/types";

export default createGenerator("js", (arg) => {
  const { routes } = arg;
  const getRoutesValue = (
    getDataRouteValue: (
      dataRoute: I18nCompiler.DataRoute,
    ) => string | Record<string, string>,
  ) => {
    return JSON.stringify(
      Object.fromEntries(
        Object.entries(routes.byId)
          .map(([routeId, dataRoute]) => [
            routeId,
            getDataRouteValue(dataRoute),
          ])
          .sort(),
      ),
      null,
      2,
    );
  };

  return {
    routes: {
      dir: createGenerator.dirs.internal,
      name: "routes",
      ext: "ts",
      index: false,
      content: () => {
        return /* j s */ `
/**
 * @internal
 */
export const routes = ${getRoutesValue((dataRoute) => dataRoute.pathnames)} as const;
`;
      },
    },
    routesError: {
      dir: createGenerator.dirs.internal,
      name: "routesError",
      ext: "ts",
      index: false,
      content: () => {
        return /* j s */ `
export type RouteIdError = (typeof routesError)[number];

/**
 * @internal
 */
export const routesError = [
  "404",
  "500",
  "403"
] as const;

/**
 * @internal
 */
export const isErrorRoute = (payload: any): payload is RouteIdError =>
  routesError.includes(payload);
`;
      },
    },
    routesSlim: {
      dir: createGenerator.dirs.internal,
      name: "routesSlim",
      ext: "ts",
      index: false,
      content: () => {
        const value = getRoutesValue(
          (dataRoute) => dataRoute.pathnamesSlim || dataRoute.pathnames,
        );
        return /* j s */ `
import type { I18n } from "../types";

/**
 * @internal
 */
export const routesSlim = ${value} as Record<string, string | Partial<Record<I18n.Locale, string>>>;
`;
      },
    },
    routesSpa: {
      dir: createGenerator.dirs.internal,
      name: "routesSpa",
      ext: "ts",
      index: false,
      content: () => {
        const value = JSON.stringify(
          Object.fromEntries(
            Object.entries(routes.byId)
              .filter(([, { pathnamesSpa }]) => !!pathnamesSpa)
              .map(([routeId, { pathnamesSpa }]) => [routeId, pathnamesSpa])
              .sort(),
          ),
          null,
          2,
        );
        return /* j s */ `
import type { I18n } from "../types";

/**
 * @internal
 */
export const routesSpa = ${value} as Record<string, string | Record<I18n.Locale, string>>;
`;
      },
    },
  };
});

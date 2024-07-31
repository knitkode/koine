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
      name: "routes",
      ext: "ts",
      content: () => {
        return /* js */ `
/**
 * @internal
 */
export const routes = ${getRoutesValue((dataRoute) => dataRoute.pathnames)} as const;

// export default routes;
`;
      },
    },
    routesError: {
      name: "routesError",
      ext: "ts",
      content: () => {
        return /* js */ `
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

// export default routesError;
`;
      },
    },
    routesSlim: {
      name: "routesSlim",
      ext: "ts",
      content: () => {
        const value = getRoutesValue(
          (dataRoute) => dataRoute.pathnamesSlim || dataRoute.pathnames,
        );
        return /* js */ `
import type { I18n } from "./types";

/**
 * @internal
 */
export const routesSlim = ${value} as Record<string, string | Partial<Record<I18n.Locale, string>>>;

// export default routesSlim;
`;
      },
    },
    routesSpa: {
      name: "routesSpa",
      ext: "ts",
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
        return /* js */ `
import type { I18n } from "./types";

/**
 * @internal
 */
export const routesSpa = ${value} as Record<string, string | Record<I18n.Locale, string>>;

export default routesSpa;
`;
      },
    },
  };
});

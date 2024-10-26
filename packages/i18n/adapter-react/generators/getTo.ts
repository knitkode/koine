import { createGenerator } from "../../compiler/createAdapter";

export default createGenerator("react", (arg) => {
  const {
    routes: { dynamicRoutes },
  } = arg;
  return {
    getTo: {
      dir: createGenerator.dirs.server,
      name: "getTo",
      ext: "ts",
      index: true,
      content: () => /* j s */ `
import { defaultLocale } from "../defaultLocale";
import { formatTo } from "../internal/formatTo";
import { routesSlim } from "../internal/routesSlim";
import type { I18n } from "../types";
import { getLocale } from "./getLocale";

/**
 * **For React RSC only**
 * 
 * @param {locale} By default it uses the current locale
 */
export function getTo(locale = getLocale()) {
  return <Id extends I18n.RouteId>(
    id: Id${
      dynamicRoutes.length
        ? `,
    ...args: Id extends I18n.RouteIdDynamic ? [I18n.RouteParams[Id]] : []`
        : ""
    }
  ) =>
    formatTo(
      locale,
      (routesSlim[id] as Record<string, string>)[locale] ??
        (routesSlim[id] as Record<string, string>)[defaultLocale] ??
        routesSlim[id] as string,${
          dynamicRoutes.length
            ? `
      args[0],`
            : ""
        }
    ) as I18n.RoutePathnames[Id];
}

export default getTo;
`,
    },
  };
});

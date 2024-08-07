import { createGenerator } from "../../compiler/createAdapter";

export default createGenerator("react", (arg) => {
  const {
    routes: { dynamicRoutes },
  } = arg;
  return {
    getTo: {
      dir: "server",
      name: "getTo",
      ext: "ts",
      index: true,
      content: () => /* js */ `
import { defaultLocale } from "../defaultLocale";
import { formatTo } from "../formatTo";
import { routesSlim } from "../routesSlim";
import type { I18n } from "../types";
import { getLocale } from "./getLocale";

/**
 * **For React RSC only**
 * 
 * By default it grabs the current locale from NodeJS' \`AsyncLocalStorage\`
 * implementation used in \`I18nLocaleContext\`.
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

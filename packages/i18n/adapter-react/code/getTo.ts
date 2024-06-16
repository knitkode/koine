import type { I18nCompiler } from "../../compiler/types";

export default ({
  routes: { dynamicRoutes },
}: I18nCompiler.AdapterArg<"react">) => `
import { defaultLocale } from "./defaultLocale";
import { getLocale } from "./getLocale";
import { routesSlim } from "./routesSlim";
import { toFormat } from "./toFormat";
import type { I18n } from "./types";

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
    toFormat(
      locale,
      (routesSlim[id] as Record<string, string>)[locale] ??
        (routesSlim[id] as Record<string, string>)[defaultLocale] ??
        routesSlim[id],${
          dynamicRoutes.length
            ? `
      args[0],`
            : ""
        }
    ) as I18n.RoutePathnames[Id];
}

export default getTo;
`;

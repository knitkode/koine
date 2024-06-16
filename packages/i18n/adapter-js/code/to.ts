import type { I18nCompiler } from "../../compiler/types";

export default ({
  routes: { dynamicRoutes, staticRoutes },
}: I18nCompiler.AdapterArg<"js">) => `
import { defaultLocale } from "./defaultLocale";${dynamicRoutes.length && staticRoutes.length ? `\nimport { isLocale } from "./isLocale";` : ``}
import { toFormat } from "./toFormat";
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

  return toFormat(
    locale,
    (routesSlim[id] as Record<string, string>)[locale] ??
      (routesSlim[id] as Record<string, string>)[defaultLocale] ??
      routesSlim[id],
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
  return toFormat(
    locale,
    (routesSlim[id] as Record<string, string>)[locale] ??
      (routesSlim[id] as Record<string, string>)[defaultLocale] ??
      routesSlim[id],
    params
  ) as I18n.RoutePathnames[Id];
}
`
       : `
export function to<Id extends I18n.RouteId>(id: Id, locale = defaultLocale) {
  return toFormat(
    locale,
    (routesSlim[id] as Record<string, string>)[locale] ??
      (routesSlim[id] as Record<string, string>)[defaultLocale] ??
      routesSlim[id],
  ) as I18n.RoutePathnames[Id];
}`
 }

export default to;
`;

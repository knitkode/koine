import type { I18nCompiler } from "../../compiler/types";

export default ({ config }: I18nCompiler.AdapterArg<"js">) => `
import { isLocale } from "./isLocale";
import { toFormat } from "./toFormat";
import { routesSlim } from "./routesSlim";
import type { I18n } from "./types";

/**
 * *To* route utility
 * 
 * @returns A localised relative URL based on your i18nCompiler configuration
 */
export function to<Id extends I18n.RouteId>(
  id: Id,
  ...args: Id extends I18n.RouteIdDynamic
    ?
        | [I18n.RouteParams[Id]]
        | [I18n.RouteParams[Id], I18n.Locale]
    : [] | [I18n.Locale]
) {
  const locale = (isLocale(args[0]) ? args[0] : args[1]) || "${config.defaultLocale}";

  return toFormat(
    locale,
    (routesSlim[id] as Record<string, string>)[locale] ??
      (routesSlim[id] as Record<string, string>)["${config.defaultLocale}"] ??
      routesSlim[id],
    isLocale(args[0]) ? undefined : args[0]
  ) as I18n.RoutePathnames[Id];
}

export default to;
`;

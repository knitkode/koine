import type { I18nCompiler } from "../../compiler";

export default ({ config }: I18nCompiler.AdapterArg) => `
import { isLocale } from "./isLocale";
import { toFormat } from "./toFormat";
import { routesSlim } from "./routesSlim";
import type { I18n } from "./types";

/**
 * *To* route utility
 * 
 * @returns A localised relative URL based on your i18nCompiler configuration
 */
export function to<TRoute extends I18n.RouteId>(
  id: TRoute,
  ...args: TRoute extends I18n.RouteIdDynamic
    ?
        | [I18n.RouteParams[TRoute]]
        | [I18n.RouteParams[TRoute], I18n.Locale]
    : [] | [I18n.Locale]
) {
  const locale = (isLocale(args[0]) ? args[0] : args[1]) || "${config.defaultLocale}";

  return toFormat(
    locale,
    routesSlim[id][locale] ?? routesSlim[id]["${config.defaultLocale}"] ?? routesSlim[id],
    isLocale(args[0]) ? undefined : args[0]
  );
}

export default to;
`;

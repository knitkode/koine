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
  const params = isLocale(args[0]) ? undefined : args[0];
  const locale = (isLocale(args[0]) ? args[0] : args[1]) || "${config.defaultLocale}";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pathname = ((routesSlim as any)[id]?.[locale] ?? routesSlim[id]) as string;

  return toFormat(locale, pathname, params);
}

export default to;
`;

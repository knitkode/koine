import type { I18nCodegen } from "../../codegen";

export default (data: I18nCodegen.Data) => `
import { isLocale } from "./isLocale";
import { toFormat } from "./toFormat";
import { routesSlim } from "./routesSlim";
import type { I18n } from "./types";

/**
 * *To* named route utility. Apart from the required _locale_ and _t_ arguments
 * it accept either a single argument if that is a static route name or a second
 * argument that interpolates the dynamic portions of the route name. The types
 * of these portions are automatically inferred.
 */
export function to<TRoute extends I18n.RouteId>(
  id: TRoute,
  ...args: TRoute extends I18n.RouteIdDynamic
    ?
        | [I18n.Utils.DynamicParams<TRoute>]
        | [I18n.Utils.DynamicParams<TRoute>, I18n.Locale]
    : [] | [I18n.Locale]
) {
  const params = isLocale(args[0]) ? undefined : args[0];
  const locale = (isLocale(args[0]) ? args[0] : args[1]) || "${data.defaultLocale}";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pathname = ((routesSlim as any)[id]?.[locale] ?? routesSlim[id]) as string;

  return toFormat(locale, pathname, params);
}

export default to;
`;

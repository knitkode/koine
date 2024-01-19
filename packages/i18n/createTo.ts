import type {
  ToRoute,
  ToRouteDynamic,
  ToRouteDynamicParams,
  ToTranslate,
} from "./types";

/**
 * `To` named route utility. Apart from the required `locale` and `t` arguments
 * it accept either a single argument if that is a static route name or a second
 * argument that interpolates the dynamic portions of the route name. The types
 * of these portions are automatically inferred.
 */
export const createTo =
  <TLocales extends string[] | readonly string[]>(
    _locales: TLocales,
    defaultLocale: TLocales[number],
    hideDefaultLocaleInUrl?: boolean,
  ) =>
  <TRoute extends ToRoute>(
    locale: TLocales[number],
    t: ToTranslate,
    routeId: TRoute,
    routeParams?: ToRouteDynamicParams<TRoute>,
  ) => {
    let relative = "";

    if (routeParams) {
      relative = t(routeId as ToRouteDynamic, routeParams).replace("*", "");
    } else {
      relative = t(routeId);
    }

    if (hideDefaultLocaleInUrl) {
      if (locale !== defaultLocale) {
        return `/${locale}${relative}`;
      }
    }

    return relative;
  };

export default createTo;

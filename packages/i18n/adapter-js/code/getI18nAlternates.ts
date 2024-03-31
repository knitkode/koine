import type { I18nCompiler } from "../../compiler/types";

export default ({ config }: I18nCompiler.AdapterArg<"js">) => {
  return `
  import { defaultLocale } from "./defaultLocale";
  import { locales } from "./locales";
  import { type RouteIdError, isErrorRoute } from "./routesError";
  import { to } from "./to";
  import type { I18n } from "./types";
  
  /**
   * @param relative Normalised, always prepended with a locale (if needed) and a slash
   */
  const toUrl = (relative: string) => "${config.baseUrl}" + relative;
  
  /**
   * @internal
   */
  export type GetAlternatesOptions<TRouteId extends I18n.RouteId | RouteIdError> =
    {
      locale: I18n.Locale;
    } & I18n.RouteArgs<TRouteId>;
  
  export function getI18nAlternates<
    TRouteId extends I18n.RouteId | RouteIdError,
  >({ locale, id, params }: GetAlternatesOptions<TRouteId>) {
    if (isErrorRoute(id)) return {};
  
    const alternates: I18n.Alternates = {
      "x-default": toUrl(
        params ? to(id, params, defaultLocale) : to(id, defaultLocale),
      ),
    };
    locales
      .filter((l) => l !== locale)
      .forEach((locale) => {
        alternates[locale] = toUrl(
          params ? to(id, params, locale) : to(id, locale),
        );
      });
  
    return alternates;
  }
  
  export default getI18nAlternates;
  `;
};

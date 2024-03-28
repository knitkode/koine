import type { I18nCompiler } from "../../compiler/types";
import { _routesSlimLookup } from "./_routesSlimLookup";

export default ({ config }: I18nCompiler.AdapterArg<"js">) => {
  return `
import type { I18n } from "./types";
import { defaultLocale } from "./defaultLocale";
import { locales } from "./locales";
import { to } from "./to";
import { routesSlim } from "./routesSlim";

const toUrl = (relative: string) => "${config.baseUrl}" + relative;

/**
 * @internal
 */
export type GetAlternatesOptions<TRouteId extends I18n.RouteId> = {
  locale: I18n.Locale;
  id: TRouteId | "404" | "500";
  params?: TRouteId extends I18n.RouteIdDynamic
    ? I18n.RouteParams[TRouteId]
    : never;
};

export function getAlternates<TRouteId extends I18n.RouteId>({
  locale,
  id,
  params,
}: GetAlternatesOptions<TRouteId>) {
  const isErrorRoute = id === "404" || id === "500";
  const alternates: I18n.Alternates = {
    "x-default": isErrorRoute
      ? ""
      : toUrl(to(id, params, defaultLocale)),
  };
  if (!isErrorRoute) {
    locales
      .filter((l) => l !== locale)
      .forEach((locale) => {
        alternates[locale] = toUrl(to(id, params, locale));
      });
  }

  return alternates;
}

export default getAlternates;
`;
};

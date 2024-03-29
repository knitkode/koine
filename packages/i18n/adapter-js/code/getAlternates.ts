import type { I18nCompiler } from "../../compiler/types";

export default ({}: I18nCompiler.AdapterArg<"js">) => {
  return `
import { defaultLocale } from "./defaultLocale";
import { locales } from "./locales";
import { to } from "./to";
import type { I18n } from "./types";

/**
 * @param relative Normalised, always prepended with a locale (if needed) and a slash
 */
const toUrl = (relative: string) => "https://your.io" + relative;

/**
 * @internal
 */
export type GetAlternatesOptions<TRouteId extends I18n.RouteId> = {
  locale: I18n.Locale;
} & I18n.RouteArgs<TRouteId>;

export function getAlternates<TRouteId extends I18n.RouteId>({
  locale,
  id,
  params,
}: GetAlternatesOptions<TRouteId>) {
  if (id === "404" || id === "500") return {};

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

export default getAlternates;
`;
};

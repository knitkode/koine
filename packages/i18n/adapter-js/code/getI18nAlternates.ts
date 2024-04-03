import type { I18nCompiler } from "../../compiler/types";

export default ({}: I18nCompiler.AdapterArg<"js">) => `
import { defaultLocale } from "./defaultLocale";
import { formatUrl } from "./formatUrl";
import { locales } from "./locales";
import { type RouteIdError, isErrorRoute } from "./routesError";
import { to } from "./to";
import type { I18n } from "./types";

/**
 * - All localised variants should always be included (despite the current lang)
 * - We use the defaultLocale's URL as the \`x-default\` alternate value
 * 
 * @internal
 * @see https://developers.google.com/search/docs/specialty/international/localized-versions#html
 */
export type GetAlternatesOptions<TRouteId extends I18n.RouteId | RouteIdError> =
  {
    locale: I18n.Locale;
  } & I18n.RouteArgs<TRouteId>;

export function getI18nAlternates<
  TRouteId extends I18n.RouteId | RouteIdError,
>({ /* locale: currentLocale, */ id, params }: GetAlternatesOptions<TRouteId>) {
  if (isErrorRoute(id)) return {};

  const alternates: I18n.Alternates = {
    "x-default": formatUrl(
      params ? to(id, params, defaultLocale) : to(id, defaultLocale),
    ),
  };
  locales
    .forEach((locale) => {
      alternates[locale] = formatUrl(
        params ? to(id, params, locale) : to(id, locale),
      );
    });

  return alternates;
}

export default getI18nAlternates;
`;

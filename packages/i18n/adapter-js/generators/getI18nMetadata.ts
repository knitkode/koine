import { createGenerator } from "../../compiler/createAdapter";

export default createGenerator("js", (arg) => {
  const {
    routes: { dynamicRoutes, staticRoutes },
  } = arg;
  return {
    getI18nMetadata: {
      dir: createGenerator.dirs.internal,
      name: "getI18nMetadata",
      ext: "ts",
      index: false,
      // prettier-ignore
      content: () => /* j s */`
import { type I18nUtils, i18nDefaultMetadata } from "@koine/i18n";
import { defaultLocale } from "../defaultLocale";
import { formatUrl } from "../formatUrl";
import { locales } from "../locales";
import { to } from "../to";
import type { I18n } from "../types";
import { type RouteIdError, isErrorRoute } from "./routesError";

type GetI18nMetadataOptions<TRouteId extends I18n.RouteId | RouteIdError> = {
  locale: I18n.Locale;
} & I18n.RouteArgs<TRouteId>;

/**
 * - All localised variants should always be included (despite the current locale)
 * - We use the defaultLocale's URL as the \`x-default\` alternate value
 * @see https://developers.google.com/search/docs/specialty/international/localized-versions#html
 *
 * @internal
 */
export function getI18nMetadata<TRouteId extends I18n.RouteId | RouteIdError>({
  locale: currentLocale,
  id,${dynamicRoutes.length ? `
  params,` : ``}${dynamicRoutes.length ? `
  paramsByLocale,` : ``}
}: GetI18nMetadataOptions<TRouteId>) {
  if (isErrorRoute(id)) return i18nDefaultMetadata;${dynamicRoutes.length && !staticRoutes.length ? `
  params = params as NonNullable<typeof params>;` : ``}
  const alternates: I18nUtils.Alternates = {
    "x-default": formatUrl(${dynamicRoutes.length && staticRoutes.length ? `
      // @ ts-ignore dynamic to fn typing
      params ? to(id, params, defaultLocale) : to(id, defaultLocale),
    ),` : dynamicRoutes.length ? `to(id, params, defaultLocale)),` : `to(id, defaultLocale)),`}
  };
  locales.forEach((locale) => {
    alternates[locale] = formatUrl(${dynamicRoutes.length && staticRoutes.length ? `
      // @ ts-ignore dynamic to fn typing
      params ? to(id, params, locale) : to(id, locale),
    );` : dynamicRoutes.length ? `to(id, paramsByLocale?.[locale] ?? params, locale));` : `to(id, locale));`}
  });

  return {
    alternates,
    canonical: formatUrl(${dynamicRoutes.length && staticRoutes.length ? `
      // @ ts-ignore dynamic to fn typing
      params ? to(id, params, currentLocale) : to(id, currentLocale),
    ),` : dynamicRoutes.length ? `to(id, params, currentLocale)),` : `to(id, currentLocale)),`}
  };
}
`,
    },
  };
});

import { createGenerator } from "../../compiler/createAdapter";

export default createGenerator("js", (arg) => {
  const {
    routes: { dynamicRoutes, staticRoutes },
  } = arg;
  return {
    getI18nMetadata: {
      name: "getI18nMetadata",
      ext: "ts",
      // prettier-ignore
      content: () => /* js */ `
import { defaultI18nMetadata } from "./defaultI18nMetadata";
import { defaultLocale } from "./defaultLocale";
import { formatUrl } from "./formatUrl";
import { locales } from "./locales";
import { type RouteIdError, isErrorRoute } from "./routesError";
import { to } from "./to";
import type { I18n } from "./types";

type GetI18nMetadataOptions<TRouteId extends I18n.RouteId | RouteIdError> = {
  locale: I18n.Locale;
} & I18n.RouteArgs<TRouteId>;

/**
 * - All localised variants should always be included (despite the current lang)
 * - We use the defaultLocale's URL as the \`x-default\` alternate value
 * @see https://developers.google.com/search/docs/specialty/international/localized-versions#html
 *
 * @internal
 */
export function getI18nMetadata<TRouteId extends I18n.RouteId | RouteIdError>({
  locale: currentLocale,
  id,${dynamicRoutes.length ? `
  params,` : ``}
}: GetI18nMetadataOptions<TRouteId>) {
  if (isErrorRoute(id)) return defaultI18nMetadata;${dynamicRoutes.length && !staticRoutes.length ? `
  params = params as NonNullable<typeof params>;` : ``}
  const alternates: I18n.Alternates = {
    "x-default": formatUrl(${dynamicRoutes.length && staticRoutes.length ? `
      // @ ts-ignore dynamic to fn typing
      params ? to(id, params, defaultLocale) : to(id, defaultLocale),
    ),` : dynamicRoutes.length ? `to(id, params, defaultLocale)),` : `to(id, defaultLocale)),`}
  };
  locales.forEach((locale) => {
    alternates[locale] = formatUrl(${dynamicRoutes.length && staticRoutes.length ? `
      // @ ts-ignore dynamic to fn typing
      params ? to(id, params, locale) : to(id, locale),
    );` : dynamicRoutes.length ? `to(id, params, locale));` : `to(id, locale));`}
  });

  return {
    alternates,
    canonical: formatUrl(${dynamicRoutes.length && staticRoutes.length ? `
      // @ ts-ignore dynamic to fn typing
      params ? to(id, params, currentLocale) : to(id, currentLocale),
    ),` : dynamicRoutes.length ? `to(id, params, currentLocale)),` : `to(id, currentLocale)),`}
  };
}

// export default getI18nMetadata;
`,
    },
  };
});

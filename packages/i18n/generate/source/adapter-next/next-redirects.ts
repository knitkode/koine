import type { Redirect as _Redirect } from "next/dist/lib/load-custom-routes";
import { arrayUniqueByProperties } from "@koine/utils";
import { formatRoutePathname } from "../../routeHelpers";
import type { I18nGenerate } from "../../types";
import { transformPathname } from "./transformPathname";

type Redirect = Omit<_Redirect, "locale"> & { locale?: boolean };

/**
 * Get path rewrite
 */
export function getPathRedirect(arg: {
  localeSource?: I18nGenerate.Locale;
  localeDestination?: I18nGenerate.Locale;
  route: I18nGenerate.DataRoute;
  template: string;
  pathname: string;
  localeParam?: string;
  permanent?: boolean;
}) {
  const { localeSource, localeDestination, template, pathname, permanent } =
    arg;

  const sourcePrefix = localeSource ? `${localeSource}/` : "";
  const source = formatRoutePathname(sourcePrefix + template);

  const destinationPrefix = localeDestination ? `${localeDestination}/` : "";
  const destination = formatRoutePathname(destinationPrefix + pathname);
  // console.log(`redirect template "${source}" to pathname "${destination}"`);

  if (source === destination) return;

  const redirect: Redirect = {
    source,
    destination,
    permanent: Boolean(permanent),
  };

  return redirect;
}

/**
 */
export function getRedirects(
  data: I18nGenerate.Data,
  localeParam: string = "",
  permanent: boolean = false,
) {
  const { routes, defaultLocale, hideDefaultLocaleInUrl } = data;
  const redirects: (Redirect | undefined)[] = [];

  for (const routeId in routes) {
    const route = routes[routeId];
    const pathnamesByLocale = routes[routeId].pathnames;
    for (const locale in pathnamesByLocale) {
      const localisedPathname = pathnamesByLocale[locale];
      const template = transformPathname(route, routeId.replace(/\./g, "/"));
      const pathname = transformPathname(route, localisedPathname);

      // we do not redirect urls children of wildcard urls
      if (route.inWildcard) break;

      const isVisibleDefaultLocale =
        locale === defaultLocale && !hideDefaultLocaleInUrl;
      const isHiddenDefaultLocale =
        locale === defaultLocale && hideDefaultLocaleInUrl;

      if (localeParam) {
        // app router:
        if (isVisibleDefaultLocale) {
          redirects.push(
            getPathRedirect({
              localeDestination: locale,
              route,
              permanent,
              template,
              pathname,
            }),
          );
        } else if (isHiddenDefaultLocale) {
          redirects.push(
            getPathRedirect({
              localeSource: locale,
              route,
              permanent,
              template,
              pathname,
            }),
          );
        } else if (locale !== defaultLocale) {
          redirects.push(
            getPathRedirect({
              localeSource: locale,
              localeDestination: locale,
              route,
              permanent,
              template,
              pathname,
            }),
          );
        } else {
          redirects.push(
            getPathRedirect({ route, permanent, template, pathname }),
          );
        }
      } else {
        // pages router:
        if (pathname !== template) {
          if (isVisibleDefaultLocale) {
            redirects.push(
              getPathRedirect({
                localeDestination: locale,
                route,
                permanent,
                template,
                pathname,
              }),
            );
          } else if (locale !== defaultLocale) {
            redirects.push(
              getPathRedirect({
                localeSource: locale,
                localeDestination: locale,
                route,
                permanent,
                template,
                pathname,
              }),
            );
          } else {
            redirects.push(
              getPathRedirect({ route, permanent, template, pathname }),
            );
          }
        }
      }
    }
  }

  const cleaned = arrayUniqueByProperties(
    redirects.filter(Boolean) as Redirect[],
    ["source", "destination"],
  ).map((rewrite) => (localeParam ? rewrite : { ...rewrite, locale: false }));

  return cleaned;
}

export default (data: I18nGenerate.Data) => {
  const value = JSON.stringify(getRedirects(data), null, 2);
  return value;
};

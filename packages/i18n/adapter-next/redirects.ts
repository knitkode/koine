import type { Redirect as _Redirect } from "next/dist/lib/load-custom-routes";
import { arrayUniqueByProperties } from "@koine/utils";
import { formatRoutePathname } from "../client";
import type { I18nCompiler } from "../compiler";
import { transformPathname } from "./transformPathname";

// type Redirect = Omit<_Redirect, "locale"> & { locale?: boolean };
type Redirect = _Redirect;

/**
 * Get path redirect
 */
function getPathRedirect(arg: {
  localeSource?: I18nCompiler.Locale;
  localeDestination?: I18nCompiler.Locale;
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
export let getRedirects = (
  config: I18nCompiler.Config,
  routes: I18nCompiler.DataRoutes,
  localeParam = "",
  permanent = false,
) => {
  const { defaultLocale, hideDefaultLocaleInUrl } = config;
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
              permanent,
              template,
              pathname,
            }),
          );
        } else if (isHiddenDefaultLocale) {
          redirects.push(
            getPathRedirect({
              localeSource: locale,
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
              permanent,
              template,
              pathname,
            }),
          );
        } else {
          redirects.push(getPathRedirect({ permanent, template, pathname }));
        }
      } else {
        // pages router:
        if (pathname !== template) {
          if (isVisibleDefaultLocale) {
            redirects.push(
              getPathRedirect({
                localeDestination: locale,
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
                permanent,
                template,
                pathname,
              }),
            );
          } else {
            redirects.push(getPathRedirect({ permanent, template, pathname }));
          }
        }
      }
    }
  }

  const cleaned = arrayUniqueByProperties(
    redirects.filter(Boolean) as Redirect[],
    ["source", "destination"],
  ).map((rewrite) => (localeParam ? rewrite : { ...rewrite, locale: false }));

  return cleaned as Redirect[];
};

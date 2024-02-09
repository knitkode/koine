import type { Rewrite as _Rewrite } from "next/dist/lib/load-custom-routes";
import { arrayUniqueByProperties } from "@koine/utils";
import { formatRoutePathname } from "../client";
import type { I18nCompiler } from "../compiler";
import { transformPathname } from "./transformPathname";

// type Rewrite = Omit<_Rewrite, "locale"> & { locale?: boolean };
type Rewrite = _Rewrite;

/**
 * Get path rewrite
 */
function getPathRewrite(arg: {
  localeSource?: I18nCompiler.Locale;
  localeDestination?: I18nCompiler.Locale;
  route: I18nCompiler.DataRoute;
  template: string;
  pathname: string;
  localeParam?: string;
}) {
  const { localeSource, localeDestination, localeParam, template, pathname } =
    arg;

  let sourcePrefix = "";
  if (localeSource) sourcePrefix = `/${localeSource}`;
  else if (localeParam) sourcePrefix = `/:${localeParam}`;

  const source = formatRoutePathname(sourcePrefix + pathname);

  let destinationPrefix = "";
  if (localeDestination) destinationPrefix = `/${localeDestination}`;
  else if (localeParam) destinationPrefix = `/:${localeParam}`;

  const destination = formatRoutePathname(destinationPrefix + template);
  // console.log(`rewrite pathname "${source}" to template "${destination}"`);

  if (source === destination) return;

  return {
    source,
    destination,
  } as Rewrite;
}

/**
 */
export let getRewrites = (
  config: I18nCompiler.Config,
  routes: I18nCompiler.DataRoutes,
  localeParam = "",
) => {
  const { defaultLocale, hideDefaultLocaleInUrl } = config;
  const rewrites: (Rewrite | undefined)[] = [];

  for (const routeId in routes) {
    const route = routes[routeId];
    const pathnamesByLocale = routes[routeId].pathnames;
    for (const locale in pathnamesByLocale) {
      const localisedPathname = pathnamesByLocale[locale];
      const isVisibleDefaultLocale =
        locale === defaultLocale && !hideDefaultLocaleInUrl;
      const isHiddenDefaultLocale =
        locale === defaultLocale && hideDefaultLocaleInUrl;
      const template = transformPathname(route, routeId.replace(/\./g, "/"));
      const pathname = transformPathname(route, localisedPathname);

      // we do not rewrite urls children of wildcard urls
      if (route.inWildcard) break;

      if (localeParam) {
        // app router:
        if (isHiddenDefaultLocale) {
          rewrites.push(
            getPathRewrite({
              localeDestination: locale,
              route,
              template,
              pathname,
            }),
          );
        } else {
          rewrites.push(
            getPathRewrite({
              localeDestination: locale,
              localeSource: locale,
              // localeParam,
              route,
              template,
              pathname,
            }),
          );
        }
      } else {
        // pages router:
        // this condition only applies to the pages router as with the app one
        // even if the template matches the pathname we always need to rewrite
        // as the localeParam is always needed in the rewrite destination
        if (pathname !== template) {
          if (locale !== defaultLocale || isVisibleDefaultLocale) {
            rewrites.push(
              getPathRewrite({
                localeSource: locale,
                route,
                template,
                pathname,
              }),
            );
          } else {
            rewrites.push(getPathRewrite({ route, template, pathname }));
          }
        }
      }
    }
  }

  const cleaned = arrayUniqueByProperties(
    rewrites.filter(Boolean) as Rewrite[],
    ["source", "destination"],
  );

  return cleaned;
};

import type { Rewrite as _Rewrite } from "next/dist/lib/load-custom-routes";
import { arrayUniqueByProperties } from "@koine/utils";
import { formatRoutePathname } from "../../../shared";
import type { I18nGenerate } from "../../types";
import { transformPathname } from "./transformPathname";

type Rewrite = Omit<_Rewrite, "locale"> & { locale?: boolean };

/**
 * Get path rewrite
 */
export function getPathRewrite(arg: {
  localeSource?: I18nGenerate.Locale;
  localeDestination?: I18nGenerate.Locale;
  route: I18nGenerate.DataRoute;
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
  };
}

/**
 */
export function getRewrites(data: I18nGenerate.Data, localeParam = "") {
  const { routes, defaultLocale, hideDefaultLocaleInUrl } = data;
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
}

export default (data: I18nGenerate.Data) => {
  const value = JSON.stringify(getRewrites(data), null, 2);
  return value;
};

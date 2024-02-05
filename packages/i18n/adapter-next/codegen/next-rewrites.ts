import { arrayUniqueByProperties } from "@koine/utils";
import type { I18nCodegen } from "../../codegen";
import { type Rewrite, getPathRewrite } from "../getPathRewrite";
import { transformPathname } from "./transformPathname";

/**
 */
export function getRewrites(data: I18nCodegen.Data, localeParam = "") {
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

export default (data: I18nCodegen.Data) => {
  const value = JSON.stringify(getRewrites(data), null, 2);
  return `module.exports = ${value}`;
};

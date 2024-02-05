import { arrayUniqueByProperties } from "@koine/utils";
import type { I18nCodegen } from "../../codegen";
import { type Redirect, getPathRedirect } from "../getPathRedirect";
import { transformPathname } from "./transformPathname";

/**
 */
export function getRedirects(
  data: I18nCodegen.Data,
  localeParam = "",
  permanent = false,
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

  return cleaned;
}

export default (data: I18nCodegen.Data) => {
  const value = JSON.stringify(getRedirects(data), null, 2);
  return `module.exports = ${value}`;
};

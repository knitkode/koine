import type { Redirect } from "next/dist/lib/load-custom-routes";
import { arrayUniqueByProperties, escapeRegExp } from "@koine/utils";
import { formatRoutePathname } from "../client";
import type { CodeDataRoutesOptions } from "../compiler/code/data-routes";
import type { I18nCompiler } from "../compiler/types";
import { transformPathname } from "./transformPathname";

function generatePathRedirect(arg: {
  localeSource?: I18nCompiler.Locale;
  localeDestination?: I18nCompiler.Locale;
  template: string;
  pathname: string;
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
 * TODO: maybe write directly the vercel configuration?
 *
 * @see
 * - https://nextjs.org/docs/pages/api-reference/next-config-js/redirects
 * - https://vercel.com/docs/projects/project-configuration#redirects
 */
export let generateRedirects = (
  config: I18nCompiler.Config,
  routes: I18nCompiler.DataRoutes["byId"],
  options: CodeDataRoutesOptions,
) => {
  const { defaultLocale, hideDefaultLocaleInUrl } = config;
  const regexIdDelimiter = new RegExp(
    escapeRegExp(options.tokens.idDelimiter),
    "g",
  );
  const redirects: (Redirect | undefined)[] = [];

  for (const routeId in routes) {
    const route = routes[routeId];
    const pathnamesByLocale = routes[routeId].pathnames;
    for (const locale in pathnamesByLocale) {
      const localisedPathname = pathnamesByLocale[locale];
      // prettier-ignore
      const template = transformPathname(routeId.replace(regexIdDelimiter, "/"), route.wildcard);
      const pathname = transformPathname(localisedPathname, route.wildcard);

      // we do not redirect urls children of wildcard urls
      if (route.inWildcard) break;

      const isDefaultLocale = locale === defaultLocale;
      const isVisibleDefaultLocale = isDefaultLocale && !hideDefaultLocaleInUrl;
      const isHiddenDefaultLocale = isDefaultLocale && hideDefaultLocaleInUrl;
      const arg = { template, pathname, permanent: options.permanentRedirects };

      if (options.localeParamName) {
        // app router:
        if (isVisibleDefaultLocale) {
          redirects.push(
            generatePathRedirect({ ...arg, localeDestination: locale }),
          );
        } else if (isHiddenDefaultLocale) {
          redirects.push(
            generatePathRedirect({ ...arg, localeSource: locale }),
          );
        } else if (!isDefaultLocale) {
          redirects.push(
            generatePathRedirect({
              ...arg,
              localeSource: locale,
              localeDestination: locale,
            }),
          );
        } else {
          redirects.push(generatePathRedirect(arg));
        }
      } else {
        // pages router:
        if (pathname !== template) {
          if (isVisibleDefaultLocale) {
            redirects.push(
              generatePathRedirect({ ...arg, localeDestination: locale }),
            );
          } else if (!isDefaultLocale) {
            redirects.push(
              generatePathRedirect({
                ...arg,
                localeSource: locale,
                localeDestination: locale,
              }),
            );
          } else {
            redirects.push(generatePathRedirect(arg));
          }
        }
      }
    }
  }

  const cleaned = arrayUniqueByProperties(
    redirects.filter(Boolean) as Redirect[],
    ["source", "destination"],
  )
    .sort((a, b) => a.source.localeCompare(b.source))
    .map((redirect) =>
      options.localeParamName ? redirect : { ...redirect, locale: false },
    );

  return cleaned as Redirect[];
};

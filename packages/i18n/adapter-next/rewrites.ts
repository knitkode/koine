import type { Rewrite } from "next/dist/lib/load-custom-routes";
import { arrayUniqueByProperties, escapeRegExp } from "@koine/utils";
import { formatRoutePathname } from "../client";
import type { CodeDataRoutesOptions } from "../compiler/code/data-routes";
import type { I18nCompiler } from "../compiler/types";
import { transformPathname } from "./transformPathname";

function generatePathRewrite(arg: {
  localeSource?: I18nCompiler.Locale;
  localeDestination?: I18nCompiler.Locale;
  template: string;
  pathname: string;
  passLocale?: boolean;
}) {
  const { localeSource, localeDestination, template, pathname, passLocale } =
    arg;

  let sourcePrefix = "";
  if (localeSource) sourcePrefix = `/${localeSource}`;

  const source = formatRoutePathname(sourcePrefix + pathname);

  let destinationPrefix = "";
  if (localeDestination) destinationPrefix = `/${localeDestination}`;
  // else if (localeParam) destinationPrefix = `/:${localeParam}`;

  const destination = formatRoutePathname(destinationPrefix + template);
  // console.log(`rewrite pathname "${source}" to template "${destination}"`);

  if (source === destination) return;

  const rewrite: Rewrite = { source, destination };

  if (passLocale === false) rewrite.locale = false;

  return rewrite;
}

export const generateRewriteForPathname = (
  config: Pick<I18nCompiler.Config, "defaultLocale" | "hideDefaultLocaleInUrl">,
  localeParam = "",
  locale: string,
  template: string,
  pathname: string,
  rewrites: (Rewrite | undefined)[],
) => {
  const { defaultLocale, hideDefaultLocaleInUrl } = config;
  const isDefaultLocale = locale === defaultLocale;
  const isHiddenDefaultLocale = isDefaultLocale && hideDefaultLocaleInUrl;
  const isHiddenLocale = isHiddenDefaultLocale; // TODO: maybe support other locales to be hidden in the URL other than the default?
  const arg = { template, pathname };

  if (localeParam) {
    // app router:
    if (isHiddenLocale) {
      rewrites.push(
        generatePathRewrite({
          ...arg,
          localeDestination: locale,
          passLocale: false,
        }),
      );
    } else {
      rewrites.push(
        // prettier-ignore
        generatePathRewrite({ ...arg, localeSource: locale, localeDestination: locale, passLocale: false }),
      );
    }
  } else {
    // pages router:
    // this condition only applies to the pages router as with the app one
    // even if the template matches the pathname we always need to rewrite
    // as the localeParam is always needed in the rewrite destination
    if (pathname !== template) {
      if (isHiddenLocale) {
        rewrites.push(generatePathRewrite(arg));
      } else {
        rewrites.push(
          // `passLocale` must be `false` or the locale prefixed rewrite won't
          // be applied and does not forward the locale to the route context
          // when the locale is included in the URL. In fact we explicitly
          // add the locale to the rewrite rule in order to get the least
          // amount of existing URLs which is a good SEO practice
          generatePathRewrite({
            ...arg,
            localeSource: locale,
            passLocale: false,
          }),
        );
      }
    }
  }
};

/**
 * TODO: maybe write directly the vercel configuration?
 *
 * @see
 * - https://nextjs.org/docs/pages/api-reference/next-config-js/rewrites
 * - https://vercel.com/docs/projects/project-configuration#rewrites
 */
export let generateRewrites = (
  config: I18nCompiler.Config,
  routes: I18nCompiler.DataRoutes["byId"],
  options: CodeDataRoutesOptions,
) => {
  const regexIdDelimiter = new RegExp(
    escapeRegExp(options.tokens.idDelimiter),
    "g",
  );
  const rewrites: (Rewrite | undefined)[] = [];

  for (const routeId in routes) {
    const route = routes[routeId];
    const pathnamesByLocale = routes[routeId].pathnames;
    for (const locale in pathnamesByLocale) {
      const localisedPathname = pathnamesByLocale[locale];
      const routeIdAsTemplate = routeId.replace(regexIdDelimiter, "/");

      // we do not rewrite urls children of wildcard urls
      if (route.inWildcard) break;

      // we need to rewrite both the root path...
      generateRewriteForPathname(
        config,
        options.localeParamName,
        locale,
        transformPathname(routeIdAsTemplate),
        transformPathname(localisedPathname),
        rewrites,
      );

      if (route.wildcard) {
        // and for wildcard routes the ones with the `/:segment*` portion
        generateRewriteForPathname(
          config,
          options.localeParamName,
          locale,
          transformPathname(routeIdAsTemplate, route.wildcard),
          transformPathname(localisedPathname, route.wildcard),
          rewrites,
        );
      }
    }
  }

  const cleaned = arrayUniqueByProperties(
    rewrites.filter(Boolean) as Rewrite[],
    ["source", "destination"],
  ).sort((a, b) => {
    // simple sort by source:
    return a.source.localeCompare(b.source);

    // simple sort by destination:
    // return a.destination.localeCompare(b.destination);

    // sort by locale
    // return a.
  });

  return cleaned;
};

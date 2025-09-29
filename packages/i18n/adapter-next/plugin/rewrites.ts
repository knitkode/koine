import type { Rewrite } from "next/dist/lib/load-custom-routes";
import { arrayUniqueByProperties, escapeRegExp, normaliseUrlPathname } from "@koine/utils";
import type { CodeDataRoutesOptions } from "../../compiler/code/data-routes";
import type { I18nCompiler } from "../../compiler/types";
import { i18nFormatRoutePathname } from "../../i18nFormatRoutePathname";
import { transformPathname } from "./utils";

export function generatePathRewrite(arg: {
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

  const source = i18nFormatRoutePathname(sourcePrefix + pathname);

  let destinationPrefix = "";
  if (localeDestination) destinationPrefix = `/${localeDestination}`;

  const destination = i18nFormatRoutePathname(destinationPrefix + template);
  // console.log(`rewrite pathname "${source}" to template "${destination}"`);

  // removed it: see test (it "should keep seemingly pointless rewrite when
  // dynamic and static paths collide")
  // TODO: these could be more sophisticated by adding a flag on the route data
  // that signals whether a static route could have some collisions with a
  // dynamic route on the same level of depth.
  // if (source === destination) return;

  const rewrite: Rewrite = { source, destination };

  if (passLocale === false) rewrite.locale = false;

  return rewrite;
}

export const generateRewriteForPathname = (
  config: Pick<
    I18nCompiler.Config,
    "defaultLocale" | "hideDefaultLocaleInUrl" | "trailingSlash"
  > &
    Pick<CodeDataRoutesOptions, "localeParamName">,
  locale: string,
  template: string,
  pathname: string,
  rewrites: (Rewrite | undefined)[],
) => {
  const { defaultLocale, hideDefaultLocaleInUrl, localeParamName } = config;
  const isDefaultLocale = locale === defaultLocale;
  const isHiddenDefaultLocale = isDefaultLocale && hideDefaultLocaleInUrl;
  const isHiddenLocale = isHiddenDefaultLocale; // TODO: maybe support other locales to be hidden in the URL other than the default?
  const arg = { template, pathname };

  if (localeParamName) {
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
  { tokens, localeParamName, permanentRedirects }: CodeDataRoutesOptions,
  routes: I18nCompiler.DataRoutes["byId"],
) => {
  const opts = { ...config, localeParamName, permanentRedirects };
  const regexIdDelimiter = new RegExp(escapeRegExp(tokens.idDelimiter), "g");
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
        opts,
        locale,
        transformPathname(routeIdAsTemplate),
        transformPathname(localisedPathname),
        rewrites,
      );

      if (route.wildcard) {
        // and for wildcard routes the ones with the `/:segment*` portion
        generateRewriteForPathname(
          opts,
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

    // 1) put dynamic paths later, after static paths, so that `/my-slug` takes
    // precedence to `/:slug` allowing us to use a custom static template on top
    // of a URL pathname that otherwise matches a dynamic template
    if (a.destination.indexOf(":") > -1) {
      return 1;
    }
    if (b.destination.indexOf(":") > -1) {
      return -1;
    }

    // 2) put first homepages which only have the locale in the url, how:
    // first ensure we normalise the pathname to the minimum (no trailing slash
    // and remove consecutive slashes, then we can split and check that we have
    // only one slash in the pathname, so e.g. `/` and `/it` will come first
    if (i18nFormatRoutePathname(a.source).split("/").length === 2) {
      // if `b` is also a homepage path we check their length and put the
      // shortest first
      if (i18nFormatRoutePathname(a.source).split("/").length === 2) {
        if (a.source.length > b.source.length) {
          return 1;
        }
      }
      return -1;
    }

    // 3) simple sort by source:
    return a.source.localeCompare(b.source);

    // 3b) simple sort by destination:
    // return a.destination.localeCompare(b.destination);
  });

  return cleaned;
};

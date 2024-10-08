import type { Redirect } from "next/dist/lib/load-custom-routes";
import { arrayUniqueByProperties, escapeRegExp } from "@koine/utils";
import type { CodeDataRoutesOptions } from "../../compiler/code/data-routes";
import type { I18nCompiler } from "../../compiler/types";
import { i18nFormatRoutePathname } from "../../i18nFormatRoutePathname";
import { transformPathname } from "./utils";

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
  const source = i18nFormatRoutePathname(sourcePrefix + template);

  const destinationPrefix = localeDestination ? `${localeDestination}/` : "";
  const destination = i18nFormatRoutePathname(destinationPrefix + pathname);
  // console.log(`redirect template "${source}" to pathname "${destination}"`);

  if (source === destination) return;

  const redirect: Redirect = {
    source,
    destination,
    permanent: Boolean(permanent),
  };

  return redirect;
}

export function generateRedirectForPathname(
  config: Pick<
    I18nCompiler.Config,
    "defaultLocale" | "hideDefaultLocaleInUrl" | "trailingSlash"
  > &
    Pick<CodeDataRoutesOptions, "localeParamName" | "permanentRedirects">,
  locale: string,
  template: string,
  pathname: string,
  redirects: (Redirect | undefined)[],
) {
  const {
    defaultLocale,
    hideDefaultLocaleInUrl,
    localeParamName,
    permanentRedirects,
  } = config;
  const isDefaultLocale = locale === defaultLocale;
  const isVisibleDefaultLocale = isDefaultLocale && !hideDefaultLocaleInUrl;
  const isHiddenDefaultLocale = isDefaultLocale && hideDefaultLocaleInUrl;
  const arg = { template, pathname, permanent: permanentRedirects };

  if (localeParamName) {
    // app router:
    if (isVisibleDefaultLocale) {
      redirects.push(
        generatePathRedirect({ ...arg, localeDestination: locale }),
      );
    } else if (isHiddenDefaultLocale) {
      redirects.push(generatePathRedirect({ ...arg, localeSource: locale }));
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

/**
 * TODO: maybe write directly the vercel configuration?
 *
 * @see
 * - https://nextjs.org/docs/pages/api-reference/next-config-js/redirects
 * - https://vercel.com/docs/projects/project-configuration#redirects
 */
export let generateRedirects = (
  config: I18nCompiler.Config,
  { localeParamName, permanentRedirects, tokens }: CodeDataRoutesOptions,
  routes: I18nCompiler.DataRoutes["byId"],
) => {
  const opts = { ...config, localeParamName, permanentRedirects };
  const regexIdDelimiter = new RegExp(escapeRegExp(tokens.idDelimiter), "g");
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

      generateRedirectForPathname(opts, locale, template, pathname, redirects);
    }
  }

  const cleaned = arrayUniqueByProperties(
    redirects.filter(Boolean) as Redirect[],
    ["source", "destination"],
  )
    .sort((a, b) => a.source.localeCompare(b.source))
    .map((redirect) =>
      localeParamName ? redirect : { ...redirect, locale: false },
    );

  return cleaned as Redirect[];
};

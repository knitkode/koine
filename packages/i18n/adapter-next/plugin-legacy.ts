import type { NextConfig } from "next";
import type { Redirect, Rewrite } from "next/dist/lib/load-custom-routes";
import { arrayUniqueByProperties, normaliseUrlPathname } from "@koine/utils";

type Route =
  | string
  | {
      [key: string]: Route | string;
    };
type RoutesByLocale = Record<string, Route>;

type Locale = string; // & { _branded: true };

type Routes = Record<Locale, RoutesByLocale>;

type RoutesMap = Record<string, RoutesMapRoute>;

type RoutesMapRoute = {
  template: string;
  pathname: string;
  wildcard?: boolean;
};

function orderRoutes(routes: Routes, defaultLocale: Locale) {
  const { [defaultLocale]: routesForDefaultLocale, ...restRoutes } = routes;

  return {
    [defaultLocale]: routesForDefaultLocale,
    ...restRoutes,
  };
}

type MapPathnameParts = Record<
  string,
  {
    isDynamic?: boolean;
    hasWildcard?: boolean;
  }
>;

/**
 * Transform the route translated defintion into a `pathname` and a `template`.
 *
 * Here we add the wildcard flag maybe found in the pathname to the template
 * name too, this is because we do not want to have the wildcard in the JSON
 * keys as those are also used to produce links through the `useTo` hook and
 * having asterisks there is a bit cumbersome.
 *
 * @see https://nextjs.org/docs/messages/invalid-multi-match
 */
function transformRoute(route: RoutesMapRoute) {
  const { pathname: rawPathname, template: rawTemplate } = route;
  const pathnameParts = rawPathname.split("/").filter((part) => !!part);
  const templateParts = rawTemplate.split("/").filter((part) => !!part);
  const mapPartsByIdx: MapPathnameParts = {};

  const pathname = pathnameParts
    .map((part) => {
      const hasWildcard = part.endsWith("*");
      part = part.replace("*", "");
      const isDynamic = part.startsWith("{{") && part.endsWith("}}");
      const asValue = isDynamic
        ? part.match(/{{(.+)}}/)?.[1].trim() ?? ""
        : part.trim();
      const asPath = encodeURIComponent(asValue) + (hasWildcard ? "*" : "");

      mapPartsByIdx[asValue] = {
        isDynamic,
        hasWildcard,
      };
      return isDynamic ? `:${asPath}` : asPath;
    })
    .join("/");

  const template = templateParts
    .map((part) => {
      const isDynamic = part.startsWith("[") && part.endsWith("]");
      const asValue = isDynamic
        ? part.match(/\[(.+)\]/)?.[1].trim() ?? ""
        : part.trim();
      const hasWildcard = mapPartsByIdx[asValue]?.hasWildcard;
      const asPath = encodeURIComponent(asValue) + (hasWildcard ? "*" : "");

      return isDynamic ? `:${asPath}` : asPath;
    })
    .join("/");

  return { pathname, template };
}

/**
 * Get routes map dictionary
 */
function getRoutesMap(
  map: RoutesMap = {},
  routesByLocale: RoutesByLocale,
  pathnameBuffer = "",
  templateBuffer = "",
) {
  const isSpaRoute = Object.keys(routesByLocale).includes("[spa]");

  for (const key in routesByLocale) {
    const pathOrNestedRoutes = routesByLocale[key];
    const template = `${templateBuffer}/${key}`;
    if (typeof pathOrNestedRoutes === "string") {
      if (!isSpaRoute || (isSpaRoute && ["[spa]", "index"].includes(key))) {
        map[template] = {
          template,
          pathname: pathOrNestedRoutes,
          wildcard: pathOrNestedRoutes.includes("*"),
        };
      }
    } else {
      if (!isSpaRoute) {
        getRoutesMap(map, pathOrNestedRoutes, pathnameBuffer, template);
      }
    }
  }

  return map;
}

/**
 * Removes `/index` from a template/url path
 */
function getWithoutIndex(template: string) {
  return template.replace(/\/index$/, "");
}

/**
 * Get path redirect
 */
function getPathRedirect(
  arg: Pick<I18nRoutesOptions, "localeParam" | "permanent"> & {
    localeSource?: Locale;
    localeDestination?: Locale;
    route: RoutesMapRoute;
    usePathnameAsSource?: boolean;
  },
) {
  const {
    localeSource,
    localeDestination,
    route,
    usePathnameAsSource,
    permanent,
  } = arg;
  const { template: routeTemplate, pathname } = transformRoute(route);
  const template = usePathnameAsSource ? pathname : routeTemplate;

  const sourcePrefix = localeSource ? `${localeSource}/` : "";
  const source = getWithoutIndex(
    `/${normaliseUrlPathname(sourcePrefix + template)}`,
  );

  const destinationPrefix = localeDestination ? `${localeDestination}/` : "";
  const destination = `/${normaliseUrlPathname(destinationPrefix + pathname)}`;
  // console.log(`redirect template "${source}" to pathname "${destination}"`);

  if (source === destination) return;

  const redirect: Redirect = {
    source,
    destination,
    permanent: Boolean(permanent),
  };

  return redirect;
}

function generateRedirects(arg: I18nRoutesOptions) {
  const {
    routes,
    defaultLocale,
    hideDefaultLocaleInUrl,
    localeParam,
    permanent,
    debug,
  } = arg;
  const orderedRoutes = orderRoutes(routes, defaultLocale);
  const redirects: (Redirect | undefined)[] = [];

  for (const locale in orderedRoutes) {
    const routesByLocale = routes[locale];
    const routesMap = getRoutesMap({}, routesByLocale);

    for (const template in routesMap) {
      const route = routesMap[template];

      if (route.pathname !== getWithoutIndex(template)) {
        const isVisibleDefaultLocale =
          locale === defaultLocale && !hideDefaultLocaleInUrl;
        const isHiddenDefaultLocale =
          locale === defaultLocale && hideDefaultLocaleInUrl;

        if (localeParam) {
          // app router:
          if (isVisibleDefaultLocale) {
            redirects.push(
              getPathRedirect({ localeDestination: locale, route, permanent }),
            );
          } else if (isHiddenDefaultLocale) {
            redirects.push(
              getPathRedirect({ localeSource: locale, route, permanent }),
            );
          } else if (locale !== defaultLocale) {
            redirects.push(
              getPathRedirect({
                localeSource: locale,
                localeDestination: locale,
                route,
                permanent,
              }),
            );
          } else {
            redirects.push(getPathRedirect({ route, permanent }));
          }
        } else {
          // pages router:
          if (isVisibleDefaultLocale) {
            redirects.push(
              getPathRedirect({ localeDestination: locale, route, permanent }),
            );
          } else if (locale !== defaultLocale) {
            redirects.push(
              getPathRedirect({
                localeSource: locale,
                localeDestination: locale,
                route,
                permanent,
              }),
            );
          } else {
            redirects.push(getPathRedirect({ route, permanent }));
          }
        }
      }
    }
  }

  const cleaned = arrayUniqueByProperties(
    redirects.filter(Boolean) as Redirect[],
    ["source", "destination"],
  ).map((rewrite) =>
    localeParam ? rewrite : { ...rewrite, locale: false as const },
  );

  if (debug)
    console.info("[@koine/next/plugin-legacy:generateRedirects]", cleaned);

  return cleaned;
}

/**
 * Get path rewrite
 */
function getPathRewrite(
  arg: Pick<I18nRoutesOptions, "localeParam"> & {
    localeSource?: Locale;
    localeDestination?: Locale;
    route: RoutesMapRoute;
  },
) {
  const { localeSource, localeDestination, localeParam, route } = arg;
  const { pathname, template } = transformRoute(route);

  let sourcePrefix = "";
  if (localeSource) sourcePrefix = `${localeSource}/`;
  else if (localeParam) sourcePrefix = `:${localeParam}/`;

  const source = `/${normaliseUrlPathname(sourcePrefix + pathname)}`;

  let destinationPrefix = "";
  if (localeDestination) destinationPrefix = `${localeDestination}/`;
  else if (localeParam) destinationPrefix = `:${localeParam}/`;

  const destination = getWithoutIndex(
    `/${normaliseUrlPathname(destinationPrefix + template)}`,
  );
  // console.log(`rewrite pathname "${source}" to template "${destination}"`);

  if (source === destination) return;

  return {
    source,
    destination,
  };
}

function generateRewrites(arg: I18nRoutesOptions) {
  const { routes, defaultLocale, hideDefaultLocaleInUrl, localeParam, debug } =
    arg;
  const orderedRoutes = orderRoutes(routes, defaultLocale);
  const rewrites: (Rewrite | undefined)[] = [];

  for (const locale in orderedRoutes) {
    const routesByLocale = routes[locale];
    const routesMap = getRoutesMap({}, routesByLocale);

    for (const template in routesMap) {
      const route = routesMap[template];
      const isVisibleDefaultLocale =
        locale === defaultLocale && !hideDefaultLocaleInUrl;
      const isHiddenDefaultLocale =
        locale === defaultLocale && hideDefaultLocaleInUrl;

      if (localeParam) {
        // app router:
        if (isHiddenDefaultLocale) {
          rewrites.push(getPathRewrite({ localeDestination: locale, route }));
        } else {
          rewrites.push(getPathRewrite({ localeParam, route }));
        }
      } else {
        // pages router:
        // this condition only applies to the pages router as with the app one
        // even if the template matches the pathname we always need to rewrite
        // as the localeParam is always needed in the rewrite destination
        if (route.pathname !== getWithoutIndex(template)) {
          if (locale !== defaultLocale || isVisibleDefaultLocale) {
            rewrites.push(getPathRewrite({ localeSource: locale, route }));
          } else {
            rewrites.push(getPathRewrite({ route }));
          }
        }
      }
    }
  }

  const cleaned = arrayUniqueByProperties(
    rewrites.filter(Boolean) as Rewrite[],
    ["source", "destination"],
  );

  if (debug)
    console.info("[@koine/next/plugin-legacy:generateRewrites]", cleaned);

  return cleaned;
}

// function getRoutesOfDefaultLocale(
//   routes: Routes | RoutesByLocale,
//   defaultLocale?: Locale,
// ) {
//   const routesByLocale = routes as RoutesByLocale;
//   if (
//     defaultLocale &&
//     routesByLocale[defaultLocale as keyof typeof routesByLocale]
//   ) {
//     return routesByLocale[defaultLocale] as Routes;
//   }
//   if (Object.keys(routes).length === 1) {
//     const routesWithOneLocale = routes as Routes;
//     let output: RoutesByLocale = {};
//     for (const onlyLocale in routesWithOneLocale) {
//       output =
//         routesWithOneLocale[onlyLocale as keyof typeof routesWithOneLocale];
//     }
//     return output;
//   }
//   return routes as Routes;
// }

/**
 * Shared options to generate Next.js `rewrites` and `redirects`
 */
type I18nRoutesOptions = {
  /**
   * A JSON file containing the routes definition mapping template folders
   * to localised slugs. It supports slugs's dynamic portions.
   * All translated slugs needs to be defined starting from root `/`.
   * The `require("...json")` file for each locale should look like:
   *
   * ```json
   * {
   *   "home": "/",
   *   "products": {
   *     "list": "/products",
   *     "[category]": "/products/{{ category }}",
   *     "[tag]": {
   *       "view": "/products/{{ category }}/{{ tag }}",
   *       "related": "/products/{{ category }}/{{ tag }}/related"
   *     }
   *   },
   *   "company": {
   *     "about": "/about",
   *     "contact": "/contact"
   *   }
   * }
   * ```
   *
   * Here we also account for wildcards, those should only be defined in the
   * pathname part of the JSON file, e.g.:
   *
   * ```json
   * {
   *   "category": {
   *     "[slug]": {
   *       "[id]": "/categories/{{ slug }}/{{ id }}*"
   *     }
   *   }
   * }
   * ```
   * This might be desired when we want to have param-based pagination, e.g. when
   * we have the following folder structure:
   *
   * ```yml
   * |__/category
   *    |__/[slug]
   *      |__/[id]
   *         |__/[[...page]].tsx
   * ```
   *
   * NB:
   * When `routes` is used be sure to pass before than the `i18n.defaultLocale`
   * configuration. That is used for localised routing.
   */
  routes: Routes;
  /**
   * Set this to true once your URL structure is definitive, this will mark all
   * the generated redirects as permanent 301 instead of the default 307
   */
  permanent?: boolean;
  locales: Locale[];
  defaultLocale: Locale;
  /**
   * @default true
   */
  hideDefaultLocaleInUrl?: boolean;
  /**
   * For app router
   * 
   @default ""
   */
  localeParam?: string;
  debug?: boolean;
};

type I18nRoutesNextOptions = Omit<
  I18nRoutesOptions,
  "locales" | "defaultLocale"
>;

export type WithI18nLegacyOptions = NextConfig & {
  i18nRoutes?: I18nRoutesNextOptions;
};

/**
 * @deprecated Better use the new `withI18n`
 */
export let withI18nLegacy = (config: WithI18nLegacyOptions): NextConfig => {
  const { i18nRoutes, ...restNextConfig } = config;

  if (!i18nRoutes) return restNextConfig;

  // set i18n related defaults grabbing them from basic next config i18n object
  const {
    locales = ["en"],
    defaultLocale = "en",
    ...restI18n
  } = config.i18n || {};

  // ensure defaults are set on next config
  restNextConfig.i18n = { ...restI18n, locales, defaultLocale };

  const options = {
    hideDefaultLocaleInUrl: true,
    localeParam: "",
    ...i18nRoutes,
    locales,
    defaultLocale,
  };
  const nextConfig: NextConfig = { ...restNextConfig };

  if (options.routes) {
    const { redirects, rewrites } = nextConfig;
    nextConfig.redirects = async () => {
      const defaults = generateRedirects(options);
      if (redirects) {
        const customs = await redirects();
        return [...defaults, ...customs];
      }
      return defaults;
    };
    nextConfig.rewrites = async () => {
      const defaults = generateRewrites(options);

      if (rewrites) {
        const customs = await rewrites();

        if (Array.isArray(customs)) {
          return {
            beforeFiles: defaults,
            afterFiles: customs,
            fallback: [],
          };
        }

        return {
          ...customs,
          beforeFiles: [...defaults, ...(customs.beforeFiles || [])],
        };
      }
      return {
        beforeFiles: defaults,
        afterFiles: [],
        fallback: [],
      };
    };
  }

  return nextConfig;
};

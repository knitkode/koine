import type { NextConfig } from "next";
import type { Redirect, Rewrite } from "next/dist/lib/load-custom-routes";
import { arrayUniqueByProperties, objectMergeWithDefaults } from "@koine/utils";
import type { CodeDataRoutesOptions } from "../compiler/code/data-routes";
import type { I18nCompilerConfig } from "../compiler/config";
import { generateRedirectForPathname } from "./redirects";
import { generateRewriteForPathname } from "./rewrites";

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

  const pathname =
    "/" +
    pathnameParts
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

  const template =
    "/" +
    templateParts
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

function generateRedirects(arg: I18nRoutesOptionsResolved) {
  const {
    routes,
    defaultLocale,
    hideDefaultLocaleInUrl,
    trailingSlash,
    localeParamName,
    permanentRedirects,
    debug,
  } = arg;
  const opts = {
    defaultLocale,
    hideDefaultLocaleInUrl,
    trailingSlash,
    localeParamName,
    permanentRedirects,
  };
  const orderedRoutes = orderRoutes(routes, defaultLocale);
  const redirects: (Redirect | undefined)[] = [];

  for (const locale in orderedRoutes) {
    const routesByLocale = routes[locale];
    const routesMap = getRoutesMap({}, routesByLocale);

    for (const routeId in routesMap) {
      const route = routesMap[routeId];
      const { template, pathname } = transformRoute(route);

      if (pathname !== getWithoutIndex(template)) {
        generateRedirectForPathname(
          opts,
          locale,
          getWithoutIndex(template),
          getWithoutIndex(pathname),
          redirects,
        );
      }
    }
  }

  const cleaned = arrayUniqueByProperties(
    redirects.filter(Boolean) as Redirect[],
    ["source", "destination"],
  ).map((rewrite) =>
    localeParamName ? rewrite : { ...rewrite, locale: false as const },
  );

  if (debug)
    console.info("[@koine/i18n/plugin-legacy:generateRedirects]", cleaned);

  return cleaned;
}

function generateRewrites(arg: I18nRoutesOptionsResolved) {
  const {
    routes,
    defaultLocale,
    hideDefaultLocaleInUrl,
    trailingSlash,
    localeParamName,
    debug,
  } = arg;
  const opts = {
    defaultLocale,
    hideDefaultLocaleInUrl,
    trailingSlash,
    localeParamName,
  };
  const orderedRoutes = orderRoutes(routes, defaultLocale);
  const rewrites: (Rewrite | undefined)[] = [];

  for (const locale in orderedRoutes) {
    const routesByLocale = routes[locale];
    const routesMap = getRoutesMap({}, routesByLocale);

    for (const routeId in routesMap) {
      const route = routesMap[routeId];
      const { template, pathname } = transformRoute(route);

      generateRewriteForPathname(
        opts,
        locale,
        getWithoutIndex(template),
        getWithoutIndex(pathname),
        rewrites,
      );
    }
  }

  const cleaned = arrayUniqueByProperties(
    rewrites.filter(Boolean) as Rewrite[],
    ["source", "destination"],
  );

  if (debug)
    console.info("[@koine/i18n/plugin-legacy:generateRewrites]", cleaned);

  return cleaned;
}

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
  debug?: boolean;
} & Pick<
  I18nCompilerConfig,
  "locales" | "defaultLocale" | "hideDefaultLocaleInUrl" | "trailingSlash"
> &
  Pick<CodeDataRoutesOptions, "localeParamName" | "permanentRedirects">;

type I18nRoutesOptionsResolved = Required<I18nRoutesOptions>;

export type WithI18nLegacyOptions = NextConfig & {
  i18nRoutes?: I18nRoutesOptions;
};

/**
 * @deprecated Better use the new `withI18n`
 */
export let withI18nLegacy = (config: WithI18nLegacyOptions): NextConfig => {
  const { i18nRoutes, ...restNextConfig } = config;

  if (!i18nRoutes) return restNextConfig;

  // set i18n related defaults grabbing them from basic next config i18n object
  const { locales: nextLocales, defaultLocale: nextDefaultLocale } =
    restNextConfig.i18n || {};

  const options = objectMergeWithDefaults(
    {
      locales: nextLocales || ["en"],
      defaultLocale: nextDefaultLocale || "en",
      hideDefaultLocaleInUrl: true,
      localeParam: "",
    },
    i18nRoutes,
  );
  const { localeParam, locales, defaultLocale, routes } = options;
  const nextConfig: NextConfig = { ...restNextConfig };

  if (localeParam) {
    // NOTE: passing the i18n settings with the app router messes up everything
    // especially while migrating from pages to app router, so opt out from that
    // and only rely on our i18n implementation
    delete nextConfig.i18n;
  } else {
    restNextConfig.i18n = restNextConfig.i18n || { locales, defaultLocale };
    restNextConfig.i18n.defaultLocale = defaultLocale;
    restNextConfig.i18n.locales = locales;
  }

  if (routes) {
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

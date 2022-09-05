import type { NextConfig } from "next";
import type { Redirect, Rewrite } from "next/dist/lib/load-custom-routes";

// type Route = string | Record<string, string | Record<string, string | Record<string, string | Record<string, string | Record<string, string>>>>>;
type Route =
  | string
  | {
      [key: string]: Route | string;
    };
type Routes = Record<string, Route>;

type RoutesMap = Record<string, RoutesMapRoute>;

type RoutesMapRoute = {
  template: string;
  pathname: string;
  wildcard?: boolean;
};

/**
 * Normalise pathname
 *
 * From a path like `/some//malformed/path///` it returns `some/malformed/path`
 *
 * - Removes subsequent slashes
 * - Removing initial and ending slashes
 * - Returns an empty string `"""` if only slashes are given
 */
export function normaliseUrlPathname(pathname = "") {
  // with return pathname.replace(/\/+\//g, "/").replace(/^\/+(.*?)\/+$/, "$1");
  // we would instead return a single slash if only slashes are given
  return pathname.replace(/\/+\//g, "/").replace(/^\/*(.*?)\/*$/, "$1");
}

/**
 * Transform to path any absolute or relative URL
 *
 * Useful when setting up `rewrites` and `redirects` especally in a [multi-zones
 * setup](https://nextjs.org/docs/advanced-features/multi-zones).
 *
 * From a path like `http://localhost/some//malformed/path///` it returns `/some/malformed/path`
 *
 * @see {@link normaliseUrlPathname}
 */
export function toPath(urlOrPathname = "") {
  let pathname = "";
  try {
    const parsed = new URL(urlOrPathname);
    pathname = parsed.pathname;
  } catch (e) {
    pathname = urlOrPathname;
  }
  // with return pathname.replace(/\/+\//g, "/").replace(/^\/+(.*?)\/+$/, "$1");
  // we would instead return a single slash if only slashes are given
  return pathname.replace(/\/+\//g, "/").replace(/^\/*(.*?)\/*$/, "$1");
}

/**
 * Clean a pathname and encode each part
 *
 * @see {@link normaliseUrlPathname}
 */
export function encodePathname(pathname = "") {
  const parts = normaliseUrlPathname(pathname).split("/");

  return parts
    .filter((part) => !!part)
    .map((part) => encodeURIComponent(part))
    .join("/");
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
 * keys as those are also used to throught the `useT` hook and having asterisks
 * there is a bit cumbersome.
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
  routes: Routes,
  pathnameBuffer = "",
  templateBuffer = ""
) {
  for (const key in routes) {
    const pathOrNestedRoutes = routes[key];
    const template = `${templateBuffer}/${key}`;
    if (typeof pathOrNestedRoutes === "string") {
      map[template] = {
        template,
        pathname: pathOrNestedRoutes,
        wildcard: pathOrNestedRoutes.includes("*"),
      };
    } else {
      getRoutesMap(map, pathOrNestedRoutes, pathnameBuffer, template);
    }
  }

  return map;
}

/**
 * Get path rewrite
 */
export function getPathRewrite(route: RoutesMapRoute) {
  const { pathname, template } = transformRoute(route);
  const source = `/${normaliseUrlPathname(pathname)}`;
  const destination = `/${normaliseUrlPathname(template)}`;
  // console.log(`rewrite pathname "${source}" to template "${destination}"`);
  return {
    source,
    destination,
  };
}

/**
 * Get path redirect
 */
export function getPathRedirect(
  locale = "",
  route: RoutesMapRoute,
  permanent?: boolean
) {
  const { template, pathname } = transformRoute(route);
  const source = `/${normaliseUrlPathname(
    (locale ? `/${locale}/` : "/") + template
  )}`;
  const destination = `/${normaliseUrlPathname(pathname)}`;
  // console.log(`redirect template "${source}" to pathname "${destination}"`);

  return {
    source,
    destination,
    permanent: Boolean(permanent),
    locale: false as const,
  };
}

/**
 */
export async function getRedirects(
  defaultLocale: string,
  routes: Routes,
  permanent?: boolean,
  debug?: boolean
) {
  const redirects: Redirect[] = [];
  const routesMap = getRoutesMap({}, routes);

  Object.keys(routesMap).forEach((template) => {
    const route = routesMap[template];

    if (route.pathname !== template) {
      redirects.push(getPathRedirect(defaultLocale, route, permanent));
      redirects.push(getPathRedirect("", route, permanent));
    }
  });
  if (debug) console.info("[@koine/next/config:getRedirects]", redirects);

  return redirects;
}

/**
 */
export async function getRewrites(routes: Routes, debug?: boolean) {
  const rewrites: Rewrite[] = [];
  const routesMap = getRoutesMap({}, routes);

  Object.keys(routesMap).forEach((template) => {
    const route = routesMap[template];
    if (route.pathname !== template) {
      rewrites.push(getPathRewrite(route));
    }
  });
  if (debug) console.info("[@koine/next/config:getRewrites]", rewrites);

  return rewrites;
}

type KoineNextConfig = {
  /** @default true Nx monorepo setup */
  nx?: boolean;
  /** @default true  Svg to react components */
  svg?: boolean;
  /** @default true  Styled components enabled */
  sc?: boolean;
  /**
   * When true uses `*.page.ts` or `*.page.tsx` extension for next.js config option [`pageExtensions`](https://nextjs.org/docs/api-reference/next.config.js/custom-page-extensions#including-non-page-files-in-the-pages-directory). When `true` it enables the same for `next-translate`
   * @default false
   */
  page?: boolean;
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
   * NOTE1:
   * You cannot name your dynamic template file "index.tsx" when they have nested
   * segments or the rewrites won't work. So while this is allowed:
   * `/pages/cats/[category]/index.tsx` it is not when you also have e.g.:
   * `/pages/cats/[category]/reviews.tsx`
   * TODO: This might be fixable? Is this fixed now?
   *
   * NOTE2:
   * When `routes` is used be sure to pass before than the `i18n.defaultLocale`
   * configuration. That is used for localised routing. By default we set `i18n`
   * as such:
   * ```js
   * {
   *   // ...nextConfig,
   *   i18n: {
   *     defaultLocale: "en",
   *     locales: ["en"],
   *   }
   * }
   * ```
   */
  routes?: Routes;
  /**
   * Whether the routes redirecting should be permanent. Switch this on once you
   * go live and the routes structure is stable.
   */
  permanent?: boolean;
  debug?: boolean;
};

/**
 * Get Next.js config with some basic opinionated defaults
 *
 * @param {object} options
 * @property {boolean} [options.nx=false] Nx monorepo setup
 * @property {boolean} [options.svg=false] Svg to react components
 * @property {boolean} [options.sc=false] Styled components enabled
 * @property {boolean} [options.page=false] When `true` uses `*.page.ts` or `*.page.tsx`
 *                                          extension for next.js config option [`pageExtensions`](https://nextjs.org/docs/api-reference/next.config.js/custom-page-extensions#including-non-page-files-in-the-pages-directory)
 *                                          and it enables the same for `next-translate`.
 */
export function withKoine(
  {
    nx = true,
    svg = true,
    sc = true,
    page,
    routes,
    permanent,
    debug,
    ...custom
  }: NextConfig & KoineNextConfig = {
    i18n: { locales: ["en"], defaultLocale: "en" },
  } as NextConfig & KoineNextConfig
) {
  const nextConfig: NextConfig = {
    // @see https://nextjs.org/docs/api-reference/next.config.js/custom-page-extensions#including-non-page-files-in-the-pages-directory
    pageExtensions: page ? ["page.tsx", "page.ts"] : undefined,
    eslint: {
      ignoreDuringBuilds: true, // we have this strict check on each commit
    },
    typescript: {
      ignoreBuildErrors: true, // we have this strict check on each commit
    },
    poweredByHeader: false,
    swcMinify: true,
    experimental: {
      // @see https://github.com/vercel/vercel/discussions/5973#discussioncomment-472618
      // @see critters error https://github.com/vercel/next.js/issues/20742
      // optimizeCss: true,
      // @see https://github.com/vercel/next.js/discussions/30174#discussion-3643870
      scrollRestoration: true,
      // concurrentFeatures: true,
      // serverComponents: true,
      // reactRoot: true,
      ...(custom["experimental"] || {}),
      // @see https://nextjs.org/docs/advanced-features/compiler#modularize-imports
      modularizeImports: {
        ...(custom?.["experimental"]?.modularizeImports || {}),
        // FIXME: make these work with the right file/folder structure?
        // "@koine/react/?(((\\w*)?/?)*)": {
        //   transform: "@koine/react/{{ matches.[1] }}/{{member}}",
        // },
        "@koine/api": { transform: "@koine/api/{{member}}" },
        "@koine/next": { transform: "@koine/next/{{member}}" },
        "@koine/utils": { transform: "@koine/utils/{{member}}" },
      },
    },
    // @see https://github.com/vercel/next.js/issues/7322#issuecomment-887330111
    reactStrictMode: true,
    ...custom,
  };

  if (svg) {
    if (nx) {
      // @see https://github.com/gregberge/svgr
      nextConfig["nx"] = {
        svgr: true,
      };
    } else {
      nextConfig.webpack = (_config, options) => {
        const webpackConfig =
          typeof nextConfig.webpack === "function"
            ? nextConfig.webpack(_config, options)
            : _config;

        // @see https://dev.to/dolearning/importing-svgs-to-next-js-nna#svgr
        webpackConfig.module.rules.push({
          test: /\.svg$/,
          use: [
            {
              loader: "@svgr/webpack",
              options: {
                svgoConfig: {
                  plugins: [
                    {
                      name: "removeViewBox",
                      active: false,
                    },
                  ],
                },
              },
            },
          ],
        });

        return webpackConfig;
      };
    }
  }

  if (sc) {
    nextConfig.compiler = {
      styledComponents: true,
    };
  }

  if (routes) {
    // we pass the default values, so we can assert I guess
    const defaultLocale = nextConfig?.i18n?.defaultLocale as string;

    return {
      ...nextConfig,
      async redirects() {
        const defaults = await getRedirects(
          defaultLocale,
          routes,
          permanent,
          debug
        );
        if (nextConfig.redirects) {
          const customs = await nextConfig.redirects();
          return [...defaults, ...customs];
        }
        return defaults;
      },
      async rewrites() {
        const defaults = await getRewrites(routes, debug);

        if (nextConfig.rewrites) {
          const customs = await nextConfig.rewrites();

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
          afterFiles: [],
          beforeFiles: defaults,
          fallback: [],
        };
      },
    };
  }

  return nextConfig;
}

export default withKoine;

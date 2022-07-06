import type { NextConfig } from "next";
import type { Redirect, Rewrite } from "next/dist/lib/load-custom-routes";

// type Route = string | Record<string, string | Record<string, string | Record<string, string | Record<string, string | Record<string, string>>>>>;
type Route =
  | string
  | {
      [key: string]: Route | string;
    };
type Routes = Record<string, Route>;

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

/**
 * It replaces `/{{ slug }}/` with the given replacer.
 */
function transformRoutePathname(rawPathname: string, replacer: string) {
  const pathNameParts = rawPathname.split("/").filter((part) => !!part);
  return pathNameParts
    .map((part, _idx) => {
      const isDynamic = part.startsWith("{{") && part.endsWith("}}");
      part = isDynamic ? replacer : part;
      // if (isDynamic && _idx === pathNameParts.length - 1) {
      //   part += "*";
      // }
      return isDynamic ? part : encodeURIComponent(part);
    })
    .join("/");
}

/**
 * It replaces `/[slug]/` with the given replacer.
 */
function transformRouteTemplate(rawPathname: string, replacer: string) {
  const pathNameParts = rawPathname.split("/").filter((part) => !!part);
  return pathNameParts
    .map((part, _idx) => {
      const isDynamic = part.startsWith("[") && part.endsWith("]");
      part = isDynamic ? replacer : part;
      // if (isDynamic && _idx === pathNameParts.length - 1) {
      //   part += "*";
      // }
      return isDynamic ? part : encodeURIComponent(part);
    })
    .join("/");
}

/**
 * Get flat key/value routes map dictionary
 */
function getRoutesMap(
  map: Record<string, string> = {},
  routes: Routes,
  pathnameBuffer = "",
  templateBuffer = ""
) {
  for (const key in routes) {
    const pathOrNestedRoutes = routes[key];
    const template = `${templateBuffer}/${key}`;
    if (typeof pathOrNestedRoutes === "string") {
      map[template] = pathOrNestedRoutes;
    } else {
      getRoutesMap(map, pathOrNestedRoutes, pathnameBuffer, template);
    }
  }

  return map;
}

/**
 * Get path rewrite
 */
export function getPathRewrite(pathname: string, template: string) {
  pathname = transformRoutePathname(pathname, ":path");
  template = transformRouteTemplate(template, ":path");
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
  pathname: string,
  template: string,
  permanent?: boolean
) {
  template = transformRouteTemplate(template, ":slug");
  pathname = transformRoutePathname(pathname, ":slug");
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
    const pathname = routesMap[template];

    if (pathname !== template) {
      redirects.push(
        getPathRedirect(defaultLocale, pathname, template, permanent)
      );
      redirects.push(getPathRedirect("", pathname, template, permanent));
    }
  });
  if (debug) console.log("redirects", redirects);

  return redirects;
}

/**
 */
export async function getRewrites(routes: Routes, debug?: boolean) {
  const rewrites: Rewrite[] = [];
  const routesMap = getRoutesMap({}, routes);

  Object.keys(routesMap).forEach((template) => {
    const pathname = routesMap[template];
    if (pathname !== template) {
      rewrites.push(getPathRewrite(pathname, template));
    }
  });
  if (debug) console.log("rewrites", rewrites);

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
   * NOTE1:
   * You cannot name your dynamic template file "index.tsx" when they have nested
   * segments or the rewrites won't work. So while this is allowed:
   * `/pages/cats/[category]/index.tsx` it is not when you also have e.g.:
   * `/pages/cats/[category]/reviews.tsx`
   * TODO: This might be fixable?
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
        // "@koine/next/?(((\\w*)?/?)*)": {
        //   transform: "@koine/next/{{ matches.[1] }}/{{member}}",
        // },
        // "@koine/react/?(((\\w*)?/?)*)": {
        //   transform: "@koine/react/{{ matches.[1] }}/{{member}}",
        // },
        // "@koine/utils/?(((\\w*)?/?)*)": {
        //   transform: "@koine/utils/{{ matches.[1] }}/{{member}}",
        // },
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

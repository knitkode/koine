import type { NextConfig } from "next";
import type { Redirect, Rewrite } from "next/dist/lib/load-custom-routes";

/**
 * Normalise pathname
 *
 * From a path like `/some//malformed/path///` it returns `some/malformed/path`
 *
 * - Removes subsequent slashes
 * - Removing initial and ending slashes
 */
export function normaliseUrlPathname(pathname: string) {
  return pathname.replace(/\/+\//g, "/").replace(/^\/+(.*?)\/+$/, "$1");
}

/**
 * Clean a pathname and encode each part
 *
 * @see {@link normaliseUrlPathname}
 */
export function encodePathname(pathname: string) {
  const parts = normaliseUrlPathname(pathname).split("/");

  return parts
    .filter((part) => !!part)
    .map((part) => encodeURIComponent(part))
    .join("/");
}

/**
 */
export function getPathRedirect(
  locale: string,
  localisedPathname: string,
  templateName: string,
  dynamic?: boolean,
  permanent?: boolean
) {
  const suffix = dynamic ? `/:slug*` : "";
  return {
    source: `/${locale}/${encodePathname(localisedPathname)}${suffix}`,
    destination: `/${encodePathname(templateName)}${suffix}`,
    permanent: Boolean(permanent),
    locale: false as const,
  };
}

/**
 */
export function getPathRewrite(
  source: string,
  destination: string,
  dynamic?: boolean
) {
  const suffix = dynamic ? `/:path*` : "";
  return {
    source: `/${encodePathname(source)}${suffix}`,
    destination: `/${encodePathname(destination)}${suffix}`,
  };
}

/**
 */
export async function getRedirects({
  defaultLocale,
  routes,
  dynamicRoutes,
  permanent,
}: {
  defaultLocale: string;
  routes: Record<string, string>;
  dynamicRoutes: Record<string, boolean>;
  permanent?: boolean;
}) {
  const redirects: Redirect[] = [];

  Object.keys(routes).forEach((page) => {
    const dynamic = dynamicRoutes[page];
    if (routes[page] !== page) {
      if (dynamic) {
        redirects.push(
          getPathRedirect(defaultLocale, page, routes[page], true, permanent)
        );
      } else {
        redirects.push(
          getPathRedirect(defaultLocale, page, routes[page], false, permanent)
        );
      }
    }
  });
  // console.log("redirects", redirects);

  return redirects;
}

/**
 */
export async function getRewrites({
  routes,
  dynamicRoutes,
}: {
  routes: Record<string, string>;
  dynamicRoutes: Record<string, boolean>;
}) {
  const rewrites: Rewrite[] = [];

  Object.keys(routes).forEach((page) => {
    const dynamic = dynamicRoutes[page];
    if (routes[page] !== page) {
      if (dynamic) {
        rewrites.push(getPathRewrite(routes[page], page, true));
      } else {
        rewrites.push(getPathRewrite(routes[page], page));
      }
    }
  });
  // console.log("rewrites", rewrites);

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
export function withKoine({
  nx = true,
  svg = true,
  sc = true,
  page,
  ...nextConfig
}: NextConfig & KoineNextConfig = {}) {
  nextConfig = {
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
      ...(nextConfig.experimental || {}),
      // @see https://nextjs.org/docs/advanced-features/compiler#modularize-imports
      modularizeImports: {
        ...(nextConfig?.experimental?.modularizeImports || {}),
        "@koine/next/?(((\\w*)?/?)*)": {
          transform: "@koine/next/{{ matches.[1] }}/{{member}}",
        },
        "@koine/react/?(((\\w*)?/?)*)": {
          transform: "@koine/react/{{ matches.[1] }}/{{member}}",
        },
        "@koine/utils/?(((\\w*)?/?)*)": {
          transform: "@koine/utils/{{ matches.[1] }}/{{member}}",
        },
      },
    },
    // @see https://github.com/vercel/next.js/issues/7322#issuecomment-887330111
    // reactStrictMode: false,
    ...nextConfig,
  } as NextConfig;

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

  return nextConfig as NextConfig;
}

export default withKoine;

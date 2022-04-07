// @ts-check

/**
 * Normalise pathname
 *
 * From a path like `/some//malformed/path///` it returns `some/malformed/path`
 *
 * - Removes subsequent slashes
 * - Removing initial and ending slashes
 *
 * @param {string} pathname
 */
function normaliseUrlPathname(pathname) {
  return pathname.replace(/\/+\//g, "/").replace(/^\/+(.*?)\/+$/, "$1");
}

/**
 * Clean a pathname and encode each part
 *
 * @see {@link normaliseUrlPathname}
 * @param {string} pathname
 */
function encodePathname(pathname) {
  const parts = normaliseUrlPathname(pathname).split("/");

  return parts
    .filter((part) => !!part)
    .map((part) => encodeURIComponent(part))
    .join("/");
}

/**
 * @param {string} locale
 * @param {string} localisedPathname
 * @param {string} templateName
 * @param {boolean} [dynamic]
 * @param {boolean} [permanent]
 */
function getPathRedirect(
  locale,
  localisedPathname,
  templateName,
  dynamic,
  permanent
) {
  const suffix = dynamic ? `/:slug*` : "";
  return {
    source: `/${locale}/${encodePathname(localisedPathname)}${suffix}`,
    destination: `/${encodePathname(templateName)}${suffix}`,
    permanent: Boolean(permanent),
    locale: /** @type {false} */ (false),
  };
}

/**
 * @param {string} source
 * @param {string} destination
 * @param {boolean} [dynamic]
 */
function getPathRewrite(source, destination, dynamic) {
  const suffix = dynamic ? `/:path*` : "";
  return {
    source: `/${encodePathname(source)}${suffix}`,
    destination: `/${encodePathname(destination)}${suffix}`,
  };
}

/**
 * @param {{
 *   defaultLocale: string;
 *   routes: Record<string, string>;
 *   dynamicRoutes: Record<string, boolean>;
 *   permanent?: boolean;
 * }} options
 */
async function getRedirects({
  defaultLocale,
  routes,
  dynamicRoutes,
  permanent,
}) {
  const redirects =
    /** @type {import("next/dist/lib/load-custom-routes").Redirect[]} */ ([]);

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
 * @param {{
 *   routes: Record<string, string>;
 *   dynamicRoutes: Record<string, boolean>;
 * }} options
 */
async function getRewrites({ routes, dynamicRoutes }) {
  const rewrites =
    /** @type {import("next/dist/lib/load-custom-routes").Rewrite[]} */ ([]);

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

/**
 * Get Next.js config with some basic opinionated defaults
 *
 * @typedef {object} KoineNextConfig
 * @property {boolean} [KoineNextConfig.nx=true] Nx monorepo setup
 * @property {boolean} [KoineNextConfig.svg=true] Svg to react components
 * @property {boolean} [KoineNextConfig.sc=true] Styled components enabled
 *
 * @typedef {import("next").NextConfig} NextConfig
 *
 * @param {NextConfig & KoineNextConfig} [config]
 * @return {NextConfig}
 */
function withConfig({ nx = true, svg = true, sc = true, ...nextConfig } = {}) {
  nextConfig = {
    // @see https://nextjs.org/docs/api-reference/next.config.js/custom-page-extensions#including-non-page-files-in-the-pages-directory
    pageExtensions: ["page.tsx", "page.ts"],
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
    },
    // @see https://github.com/vercel/next.js/issues/7322#issuecomment-887330111
    // reactStrictMode: false,
    ...nextConfig,
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

  return nextConfig;
}

withConfig.normaliseUrlPathname = normaliseUrlPathname;
withConfig.encodePathname = encodePathname;
withConfig.getPathRedirect = getPathRedirect;
withConfig.getPathRewrite = getPathRewrite;
withConfig.getRedirects = getRedirects;
withConfig.getRewrites = getRewrites;
withConfig.withConfig = withConfig;

module.exports = withConfig;

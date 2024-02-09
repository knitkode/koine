import type { NextConfig } from "next";
import { ContextReplacementPlugin } from "webpack";
import { type I18nCompilerOptions, i18nCompiler } from "../compiler";
import { getRedirects } from "./redirects";
import { getRewrites } from "./rewrites";

// import { I18nWebpackPlugin } from "./webpackPluginI18n";

export type WithI18nOptions = NextConfig & {
  i18nCompiler?: I18nCompilerOptions & {
    appRouterLocaleParamName?: string;
    permanentRedirects?: boolean;
  };
};

type NextConfigFn = (
  phase: string,
  context?: any,
) => Promise<NextConfig> | NextConfig;

/**
 * See [`withNx`](https://github.com/nrwl/nx/blob/master/packages/next/plugins/with-nx.ts#L216)
 * next plugin for inspiration on how to structure our async compiler task
 *
 * About next.config phases see https://github.com/vercel/next.js/discussions/48736
 */
export let withI18n =
  (nextConfig: WithI18nOptions = {}): NextConfigFn =>
  async (phase: string) => {
    const { PHASE_PRODUCTION_BUILD, PHASE_DEVELOPMENT_SERVER } = await import(
      "next/constants"
    );

    // bail if we are not building or running the dev server
    if (![PHASE_PRODUCTION_BUILD, PHASE_DEVELOPMENT_SERVER].includes(phase)) {
      return nextConfig;
    }
    // bail if user has not defined the compiler options object
    if (!nextConfig.i18nCompiler) {
      return nextConfig;
    }

    const { appRouterLocaleParamName, permanentRedirects } =
      nextConfig.i18nCompiler;
    const { code, config } = await i18nCompiler(nextConfig.i18nCompiler);
    const { locales, defaultLocale } = config;

    if (appRouterLocaleParamName) {
      // app router:
      // NOTE: after thousands attempts turns out that passing the i18n settings
      // to the app router messes up everything, just rely on our internal i18n
      // mechanisms
      delete nextConfig.i18n;
    } else {
      // pages routes:
      nextConfig.i18n = nextConfig.i18n || { locales, defaultLocale };
      nextConfig.i18n.locales = locales;
      nextConfig.i18n.defaultLocale = defaultLocale;
    }

    const defaultRedirects = getRedirects(
      config,
      code.routes,
      appRouterLocaleParamName,
      permanentRedirects,
    );

    nextConfig.redirects = async () => {
      if (nextConfig.redirects) {
        const custom = await nextConfig.redirects();
        return [...defaultRedirects, ...custom];
      }
      return defaultRedirects;
    };

    const defaultRewrites = getRewrites(
      config,
      code.routes,
      appRouterLocaleParamName,
    );

    nextConfig.rewrites = async () => {
      if (nextConfig.rewrites) {
        const custom = await nextConfig.rewrites();

        if (Array.isArray(custom)) {
          return {
            beforeFiles: defaultRewrites,
            afterFiles: custom,
            fallback: [],
          };
        }

        return {
          ...custom,
          beforeFiles: [...defaultRewrites, ...(custom.beforeFiles || [])],
        };
      }
      return {
        beforeFiles: defaultRewrites,
        afterFiles: [],
        fallback: [],
      };
    };

    nextConfig.webpack = (webpackConfig) => {
      // @see https://github.com/date-fns/date-fns/blob/main/docs/webpack.md#removing-unused-languages-from-dynamic-import
      webpackConfig.plugins.push(
        new ContextReplacementPlugin(
          /^date-fns[/\\]locale$/,
          new RegExp(`\\.[/\\\\](${locales.join("|")})[/\\\\]index\\.js$`),
        ),
      );

      return webpackConfig;
    };

    // TODO: move to next-translate adapter
    // return withTranslate(newNextConfig);

    // nextConfig.webpack = (webpackConfig) => {
    //   // nextConfig.webpack = (_config, options) => {
    //   //   const webpackConfig =
    //   //     typeof nextConfig.webpack === "function"
    //   //       ? nextConfig.webpack(_config, options)
    //   //       : _config;

    //   webpackConfig.plugins.push(new I18nWebpackPlugin(config));

    //   return webpackConfig;
    // };

    return nextConfig;
  };

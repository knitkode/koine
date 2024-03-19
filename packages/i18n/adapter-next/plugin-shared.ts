import type { NextConfig } from "next";
import { ContextReplacementPlugin } from "webpack";
import type { I18nCompilerReturn } from "../compiler";
import { generateRedirects } from "./redirects";
import { generateRewrites } from "./rewrites";

export type I18nCompilerNextOptions = {
  permanentRedirects?: boolean;
};

export let tweakNextConfig = (
  options: I18nCompilerReturn & I18nCompilerNextOptions,
  nextConfig: NextConfig,
) => {
  const {
    config: { defaultLocale, locales },
    code: {
      options: {
        routes: { localeParamName },
      },
    },
  } = options;
  if (localeParamName) {
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

  return nextConfig;
};

export let getRedirects = async (
  prevRedirects: NextConfig["redirects"],
  i18nResult: I18nCompilerReturn,
) => {
  const defaultRedirects = generateRedirects(
    i18nResult.config,
    i18nResult.code.routes.byId,
    i18nResult.code.options.routes,
  );

  if (prevRedirects) {
    const custom = await prevRedirects();
    return [...defaultRedirects, ...custom];
  }
  return defaultRedirects;
};

export let getRewrites = async (
  prevRewrites: NextConfig["rewrites"],
  i18nResult: I18nCompilerReturn,
) => {
  const defaultRewrites = generateRewrites(
    i18nResult.config,
    i18nResult.code.routes.byId,
    i18nResult.code.options.routes,
  );
  if (prevRewrites) {
    const custom = await prevRewrites();

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

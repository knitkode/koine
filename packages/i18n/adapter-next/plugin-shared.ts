import type { NextConfig } from "next";
import { join } from "path";
import { ContextReplacementPlugin, DefinePlugin } from "webpack";
import { swcCreateTransform } from "@koine/node/swc";
import type { I18nCompilerOptions, I18nCompilerReturn } from "../compiler";
import { generateRedirects } from "./redirects";
import { generateRewrites } from "./rewrites";
import { I18nWebpackPlugin } from "./webpackPluginI18n";

export let tweakNextConfig = (
  i18nCompilerOptions: I18nCompilerOptions,
  i18nCompilerReturn: I18nCompilerReturn,
  options: NextConfig,
) => {
  const {
    config: { defaultLocale, locales },
    code: {
      options: {
        routes: { localeParamName },
        write,
      },
    },
  } = i18nCompilerReturn;
  const { webpack, i18n, modularizeImports = {}, ...restNextConfig } = options;
  const nextConfig: NextConfig = {
    ...restNextConfig,
    modularizeImports: {
      ...swcCreateTransform("@koine/i18n"),
      // automatically create swc transforms based on given options
      ...(write?.tsconfig ? swcCreateTransform(write.tsconfig.alias) : {}),
      ...modularizeImports,
    },
    webpack: (_webpackConfig, webpackConfigContext) => {
      const webpackConfig =
        typeof webpack === "function"
          ? webpack(_webpackConfig, webpackConfigContext)
          : _webpackConfig;

      return {
        ...webpackConfig,
        plugins: [
          ...(webpackConfig.plugins || []),
          new I18nWebpackPlugin(i18nCompilerOptions),
          // @see https://github.com/date-fns/date-fns/blob/main/docs/webpack.md#removing-unused-languages-from-dynamic-import
          new ContextReplacementPlugin(
            /^date-fns[/\\]locale$/,
            new RegExp(`\\.[/\\\\](${locales.join("|")})[/\\\\]index\\.js$`),
          ),
          write &&
            new DefinePlugin(
              require(join(write.cwd, write.output, "internal/webpack-define")),
            ),
        ].filter(Boolean),
      };
    },
  };

  // const nextConfig =
  if (localeParamName) {
    // NOTE: passing the i18n settings with the app router messes up everything
    // especially while migrating from pages to app router, so opt out from that
    // and only rely on our i18n implementation
    delete nextConfig.i18n;
  } else {
    nextConfig.i18n = nextConfig.i18n || { locales, defaultLocale };
    nextConfig.i18n.locales = locales;
    nextConfig.i18n.defaultLocale = defaultLocale;
  }

  return nextConfig;
};

export let getRedirects = async (
  prevRedirects: NextConfig["redirects"],
  i18nResult: I18nCompilerReturn,
) => {
  const defaultRedirects = generateRedirects(
    i18nResult.config,
    i18nResult.code.options.routes,
    i18nResult.code.routes.byId,
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
    i18nResult.code.options.routes,
    i18nResult.code.routes.byId,
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

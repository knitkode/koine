import { createRequire } from "node:module";
import type { NextConfig } from "next";
import type { I18nCompilerOptions } from "../compiler";
import { i18nCompilerSync } from "../compiler-sync";
import { getRedirects, getRewrites, tweakNextConfig } from "./plugin-shared";

const require = createRequire(import.meta.url);

export type WithI18nOptions = NextConfig & {
  i18nCompiler?: I18nCompilerOptions;
};

export let withI18n = (config: WithI18nOptions = {}): NextConfig => {
  const {
    i18nCompiler: i18nCompilerOptions,
    redirects,
    rewrites,
    ...restNextConfig
  } = config;
  let nextConfig: NextConfig = restNextConfig;

  // bail if user has not defined the compiler options object
  if (!i18nCompilerOptions) return nextConfig;

  const i18nResult = i18nCompilerSync(i18nCompilerOptions);

  nextConfig = tweakNextConfig(i18nCompilerOptions, i18nResult, nextConfig);

  nextConfig.redirects = () => getRedirects(redirects, i18nResult);

  nextConfig.rewrites = () => getRewrites(rewrites, i18nResult);

  const {
    options: { adapter },
  } = i18nResult;

  if (adapter.name === "next-translate") {
    if (adapter.loader !== false) {
      try {
        const withNextTranslate = require("next-translate-plugin");
        nextConfig = withNextTranslate(nextConfig);

        // TODO: verify this:
        // when using the locale param name structure just force to opt-out from
        // next.js built in i18n support for pages router, this should also
        // ease the cohexistence of pages and app router
        if (i18nResult.options.routes.localeParamName) {
          delete nextConfig.i18n;
        }
      } catch (_e) {
        // console.log()
      }
    }
  }

  return nextConfig;
};

// import { I18nWebpackPlugin } from "./webpackPluginI18n";
// TODO: move to next-translate adapter?
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

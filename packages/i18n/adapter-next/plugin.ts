import { createRequire } from "node:module";
import type { NextConfig } from "next";
import { type I18nCompilerOptions } from "../compiler";
import { i18nCompilerSync } from "../compiler-sync";
import {
  type I18nCompilerNextOptions,
  getRedirects,
  getRewrites,
  tweakNextConfig,
} from "./plugin-shared";

const require = createRequire(import.meta.url);

export type WithI18nOptions = NextConfig & {
  i18nCompiler?: I18nCompilerOptions & I18nCompilerNextOptions;
};

export let withI18n = (config: WithI18nOptions = {}): NextConfig => {
  const {
    i18nCompiler: i18nConfig,
    redirects,
    rewrites,
    ...restNextConfig
  } = config;
  let nextConfig: NextConfig = restNextConfig;

  // bail if user has not defined the compiler options object
  if (!i18nConfig) return nextConfig;

  const i18nResult = i18nCompilerSync(i18nConfig);

  nextConfig = tweakNextConfig(i18nResult.config, nextConfig);

  nextConfig.redirects = () => getRedirects(redirects, i18nConfig, i18nResult);

  nextConfig.rewrites = () => getRewrites(rewrites, i18nConfig, i18nResult);

  if (i18nConfig.code.adapter === "next-translate") {
    try {
      const withNextTranslate = require("next-translate-plugin");
      nextConfig = withNextTranslate(nextConfig);
    } catch (e) {
      // console.log()
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

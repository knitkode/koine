import type { NextConfig } from "next";
import type { SetRequired } from "@koine/utils";
import {
  type I18nCompilerOptions,
  type I18nCompilerReturn,
  i18nCompiler,
} from "../compiler";
import {
  type I18nCompilerNextOptions,
  getRedirects,
  getRewrites,
  tweakNextConfig,
} from "./plugin-shared";

export type WithI18nOptions = NextConfig & {
  i18nCompiler?: SetRequired<I18nCompilerOptions, "defaultLocale" | "locales"> &
    I18nCompilerNextOptions;
};

export let withI18n = (nextConfig: WithI18nOptions = {}): NextConfig => {
  const {
    i18nCompiler: options,
    redirects: prevRedirects,
    rewrites: prevRewrites,
  } = nextConfig;

  // bail if user has not defined the compiler options object
  if (!options) return nextConfig;

  let i18nResult: I18nCompilerReturn | undefined;

  nextConfig.redirects = async () => {
    i18nResult = i18nResult || (await i18nCompiler(options));
    return await getRedirects(prevRedirects, options, i18nResult);
  };

  nextConfig.rewrites = async () => {
    i18nResult = i18nResult || (await i18nCompiler(options));
    return await getRewrites(prevRewrites, options, i18nResult);
  };

  return tweakNextConfig(options, nextConfig);
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

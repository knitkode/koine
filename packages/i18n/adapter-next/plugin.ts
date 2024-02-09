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

export let withI18n = (config: WithI18nOptions = {}): NextConfig => {
  const {
    i18nCompiler: i18nConfig,
    redirects,
    rewrites,
    ...restNextConfig
  } = config;
  const nextConfig: NextConfig = restNextConfig;

  // bail if user has not defined the compiler options object
  if (!i18nConfig) return nextConfig;

  let i18nResult: I18nCompilerReturn | undefined;

  nextConfig.redirects = async () => {
    i18nResult = i18nResult || (await i18nCompiler(i18nConfig));
    return await getRedirects(redirects, i18nConfig, i18nResult);
  };

  nextConfig.rewrites = async () => {
    i18nResult = i18nResult || (await i18nCompiler(i18nConfig));
    return await getRewrites(rewrites, i18nConfig, i18nResult);
  };

  return tweakNextConfig(i18nConfig, nextConfig);
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

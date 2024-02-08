import type { NextConfig } from "next";
import type { I18nCompilerOptions } from "../compiler";
import { I18nWebpackPlugin } from "./webpackPluginI18n";

export type WithI18n = I18nCompilerOptions;

/**
 * TODO: automatically load the compiler generated plugin `withI18n.js`
 */
export let withI18n =
  (config: WithI18n = {}) =>
  (nextConfig: NextConfig) => {
    nextConfig.webpack = (webpackConfig) => {
      // nextConfig.webpack = (_config, options) => {
      //   const webpackConfig =
      //     typeof nextConfig.webpack === "function"
      //       ? nextConfig.webpack(_config, options)
      //       : _config;

      webpackConfig.plugins.push(new I18nWebpackPlugin(config));

      return webpackConfig;
    };

    return nextConfig;
  };

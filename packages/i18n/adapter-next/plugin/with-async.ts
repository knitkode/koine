import type { NextConfig } from "next";
import { type I18nCompilerOptions, i18nCompiler } from "../../compiler";
import {
  getRedirects,
  getRewrites,
  shouldIgnoreNextJsConfigRun,
  tweakNextConfig,
} from "./utils";

type NextConfigFn = (
  phase: string,
  context?: any,
) => Promise<NextConfig> | NextConfig;

export type WithI18nAsyncOptions = NextConfig & {
  /**
   * Configure the {@link I18nCompilerOptions I18nCompiler}
   */
  i18nCompiler?: I18nCompilerOptions;
};

/**
 * See [`withNx`](https://github.com/nrwl/nx/blob/master/packages/next/plugins/with-nx.ts#L216)
 * next plugin for inspiration on how to structure our async compiler task
 *
 * About next.config phases see https://github.com/vercel/next.js/discussions/48736
 */
export let withI18nAsync =
  (config: WithI18nAsyncOptions = {}): NextConfigFn =>
  async (/* phase: string */) => {
    const {
      i18nCompiler: i18nCompilerOptions,
      redirects,
      rewrites,
      ...restNextConfig
    } = config;
    let nextConfig: NextConfig = restNextConfig;
    // const { PHASE_PRODUCTION_BUILD, PHASE_DEVELOPMENT_SERVER } = await import(
    //   "next/constants"
    // );
    // // bail if we are not building or running the dev server
    // if (![PHASE_PRODUCTION_BUILD, PHASE_DEVELOPMENT_SERVER].includes(phase)) {
    //   return nextConfig;
    // }

    // bail if user has not defined the compiler options object
    if (!i18nCompilerOptions) return nextConfig;

    if (shouldIgnoreNextJsConfigRun()) return nextConfig;

    const i18nResult = await i18nCompiler(i18nCompilerOptions);

    nextConfig = tweakNextConfig(i18nCompilerOptions, i18nResult, nextConfig);

    nextConfig.redirects = () => getRedirects(redirects, i18nResult);

    nextConfig.rewrites = () => getRewrites(rewrites, i18nResult);

    return nextConfig;
  };

import type { NextConfig } from "next";
import { type I18nCompilerOptions, i18nCompiler } from "../compiler";
import {
  type I18nCompilerNextOptions,
  getRedirects,
  getRewrites,
  tweakNextConfig,
} from "./plugin-shared";

type NextConfigFn = (
  phase: string,
  context?: any,
) => Promise<NextConfig> | NextConfig;

export type WithI18nAsyncOptions = NextConfig & {
  i18nCompiler?: I18nCompilerOptions & I18nCompilerNextOptions;
};

/**
 * See [`withNx`](https://github.com/nrwl/nx/blob/master/packages/next/plugins/with-nx.ts#L216)
 * next plugin for inspiration on how to structure our async compiler task
 *
 * About next.config phases see https://github.com/vercel/next.js/discussions/48736
 */
export let withI18nAsync =
  (nextConfig: WithI18nAsyncOptions = {}): NextConfigFn =>
  async (/* phase: string */) => {
    const {
      i18nCompiler: options,
      redirects: prevRedirects,
      rewrites: prevRewrites,
    } = nextConfig;
    // const { PHASE_PRODUCTION_BUILD, PHASE_DEVELOPMENT_SERVER } = await import(
    //   "next/constants"
    // );
    // // bail if we are not building or running the dev server
    // if (![PHASE_PRODUCTION_BUILD, PHASE_DEVELOPMENT_SERVER].includes(phase)) {
    //   return nextConfig;
    // }

    // bail if user has not defined the compiler options object
    if (!options) return nextConfig;

    const i18nResult = await i18nCompiler(options);

    nextConfig.redirects = () =>
      getRedirects(prevRedirects, options, i18nResult);

    nextConfig.rewrites = () => getRewrites(prevRewrites, options, i18nResult);

    return tweakNextConfig(i18nResult.config, nextConfig);
  };

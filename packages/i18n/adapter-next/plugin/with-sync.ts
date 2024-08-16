/**
 * @fileoverview
 *
 * NOTE: we could perhaps move to [_Next.js_ Instrumentation](https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation)
 * rather than running the sync version of the compiler. But, besides the fact
 * that that api is still experimental we also would not easily be able to use
 * the compiler return data to customize the redirects/rewrites/webpack
 * configurations in next.config.js. This is also the reason why we cannot
 * simply hook into webpack compilation to run the compiler, as we always need
 * its result at the very beginning.
 */
import { createRequire } from "node:module";
import type { NextConfig } from "next";
import type { I18nCompilerOptions } from "../../compiler";
import { i18nCompilerSync } from "../../compiler-sync";
import {
  getRedirects,
  getRewrites,
  shouldIgnoreNextJsConfigRun,
  tweakNextConfig,
} from "./utils";

const require = createRequire(import.meta.url);

export type WithI18nOptions = NextConfig & {
  /**
   * Configure the {@link I18nCompilerOptions I18nCompiler}
   */
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

  if (shouldIgnoreNextJsConfigRun()) return nextConfig;

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
        //
      }
    }
  }

  return nextConfig;
};

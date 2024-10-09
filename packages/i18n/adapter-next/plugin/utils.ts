import type { NextConfig } from "next";
import { join } from "path";
import { ContextReplacementPlugin, DefinePlugin } from "webpack";
import type { I18nCompilerOptions, I18nCompilerReturn } from "../../compiler";
import { createSwcTransforms } from "../../compiler/createSwcTransforms";
import { generateRedirects } from "./redirects";
import { generateRewrites } from "./rewrites";
import { I18nWebpackPlugin } from "./webpackPluginI18n";

/**
 * `next.config` runs twice, running the compiler only once is enough, the condition
 * is dependent on the environment as
 *
 * - [next.config.js executes multiple times?](https://github.com/vercel/next.js/discussions/11863)
 * - [paraglide solution](https://github.com/opral/monorepo/blob/main/inlang/source-code/paraglide/paraglide-next/src/plugin/index.ts#L55)
 */
export function shouldIgnoreNextJsConfigRun() {
  return (
    // while developing we need the private worker process, so ignore this:
    (process.env.NODE_ENV === "development" &&
      !process.env["NEXT_PRIVATE_WORKER"]) ||
    // while building we need the main process, so ignore this:
    (process.env.NODE_ENV === "production" &&
      process.env["NEXT_PRIVATE_WORKER"])
  );
}

/**
 * Transform the route translated either into a `pathname` or a `template`.
 *
 * Here we add the wildcard flag maybe found in the pathname to the template
 * name too.
 *
 * @see https://nextjs.org/docs/messages/invalid-multi-match
 */
export function transformPathname(
  rawPathnameOrTemplate: string,
  wildcard?: boolean,
) {
  return (
    "/" +
    rawPathnameOrTemplate
      .split("/")
      .filter(Boolean)
      .map((part) => {
        if (part.startsWith("[[...")) {
          return `:${encodeURIComponent(part.slice(5, -2))}`;
        }
        if (part.startsWith("[[")) {
          return `:${encodeURIComponent(part.slice(2, -2))}`;
        }
        if (part.startsWith("[")) {
          return `:${encodeURIComponent(part.slice(1, -1))}`;
        }
        return `${encodeURIComponent(part)}`;
      })
      .join("/") +
    (wildcard ? "/:wildcard*" : "")
  );
}

export let tweakNextConfig = (
  i18nCompilerOptions: I18nCompilerOptions,
  i18nCompilerReturn: I18nCompilerReturn,
  options: NextConfig,
) => {
  const {
    config: { defaultLocale, locales },
    options: {
      routes: { localeParamName },
      write,
    },
  } = i18nCompilerReturn;
  const { webpack, i18n, modularizeImports = {}, ...restNextConfig } = options;
  const nextConfig: NextConfig = {
    ...restNextConfig,
    modularizeImports: {
      ...createSwcTransforms(i18nCompilerReturn.options),
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
              // require(join(write.cwd, write.output, "internal/webpack-define-compact.cjs")),
              require(
                join(
                  write.cwd,
                  write.output,
                  "internal/webpack-define-granular.cjs",
                ),
              ),
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
    i18nResult.options.routes,
    i18nResult.routes.byId,
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
    i18nResult.options.routes,
    i18nResult.routes.byId,
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

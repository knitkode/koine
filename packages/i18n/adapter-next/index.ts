import {
  type Options as AdapterReactOptions,
  adapterReact,
} from "../adapter-react";
import { createAdapter } from "../compiler/createAdapter";
import nextRedirects from "./generators/next-redirects";
import nextRewrites from "./generators/next-rewrites";
// router-app
import I18nLayout from "./generators/router-app/I18nLayout";
import I18nLayoutRoot from "./generators/router-app/I18nLayoutRoot";
import I18nPage from "./generators/router-app/I18nPage";
import i18nServer from "./generators/router-app/i18nServer";
// router-pages
import I18nApp from "./generators/router-pages/I18nApp";
import I18nDocument from "./generators/router-pages/I18nDocument";
import I18nHead from "./generators/router-pages/I18nHead";
import I18nSetter from "./generators/router-pages/I18nSetter";
import i18nGet from "./generators/router-pages/i18nGet";
import useRouteId from "./generators/useRouteId";
import webpackDefine from "./generators/webpack-define";

// export type Options = typeof adapterReact.defaultOptions & {
export type Options = AdapterReactOptions & {
  /**
   * @default "app"
   */
  router: "app" | "pages" | "migrating";
  /**
   * Configure the generation of globally exposed api
   */
  // TODO: here we could add options like generating only by matching a custom
  // filter (function or regex), tweak the "styling" in which the globals are
  // generated
  globalize: {
    /**
     * The name of the global variable  defined through the `Webpack.DefinePlugin`
     * implementation which holds an object with the i18n functions as properties.
     *
     * NB: This should be added to your **eslint** configuration, e.g. in your
     * `eslint.config.js` flat config with:
     *
     * ```js
     * module.exports = [{
     *   languageOptions: {
     *     globals: {
     *       i18n: false,
     *     }
     *   },
     * }];
     * ```
     *
     * @default "i18n"
     */
    prefix: string;
    /**
     * Configure the generation of globally exposed functions.
     * In this adapter these functions are created through [`Webpack.DefinePlugin`](https://webpack.js.org/plugins/define-plugin/).
     *
     * You can generate all-or-nothing by passing a `boolean` or handpick which
     * categories of functions to generate.
     *
     * @default true
     */
    functions:
      | boolean
      | {
          /**
           * Configure generation of _routes_' `to` functions
           */
          routes: boolean;
          /**
           * Configure generation of _translations_' `t` functions
           */
          translations: boolean;
        };
  };
};

/**
 * We add `safePrefix`: when `prefix` is present we add an underscore after it
 * and remove consecutive underscores in case the user defined prefix already
 * had an ending underscore.
 */
export function resolveGlobalizeOption(globalize: Options["globalize"]) {
  const { functions, prefix } = globalize;

  return {
    prefix: prefix || "",
    prefixSafe: prefix ? (prefix + "_").replace(/_+$/, "_") : "",
    functions:
      typeof functions === "boolean"
        ? {
            routes: true,
            translations: true,
          }
        : functions,
  } satisfies Options["globalize"] & {
    prefixSafe: string;
  };
}

export const adapterNext = createAdapter({
  name: "next",
  defaultOptions: {
    ...adapterReact.defaultOptions,
    router: "app",
    globalize: {
      prefix: "i18n",
      functions: true,
    },
  } satisfies Options,
  getGenerators: (data) => {
    const { router } = data.options.adapter;
    return [
      ...adapterReact.getGenerators(data),
      ...[nextRedirects, nextRewrites],
      ...(router === "app" || router === "migrating"
        ? [I18nLayout, I18nLayoutRoot, I18nPage, i18nServer]
        : []),
      ...(router === "pages" || router === "migrating"
        ? [I18nApp, I18nDocument, I18nHead, I18nSetter, i18nGet]
        : []),
      useRouteId,
      webpackDefine,
    ];
  },
  getTransformers: (data) => {
    const { router } = data.options.adapter;

    return {
      I18nHeadTags: false,
      // e.g. remove a parent adapter ("react") file from the index
      // SomeFileId: (file) => ({ ...file, index: false }),
      ...(router === "app"
        ? {
            I18nEffects: false,
          }
        : {}),
    };
  },
});

export type Adapter = typeof adapterNext;

export default adapterNext;

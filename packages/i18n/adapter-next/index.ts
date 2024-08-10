import { adapterReact } from "../adapter-react";
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

export type Options = typeof adapterReact.defaultOptions & {
  /**
   * @default "app"
   */
  router: "app" | "pages" | "migrating";
};

export const adapterNext = createAdapter({
  name: "next",
  defaultOptions: {
    ...adapterReact.defaultOptions,
    router: "app",
  } satisfies Options,
  getGenerators: (data) => {
    const { router } = data.options.adapter;
    return [
      ...adapterReact.getGenerators(data),
      // TODO: maybe remove these generators, they are useful for debugging for
      // now but probably will be useless
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
      // remove a parent adapter ("react") file from the index
      I18nMetadataProvider: (file) => ({ ...file, index: false }),
      I18nRouteProvider: (file) => ({ ...file, index: false }),
      ...(router === "app"
        ? {
            I18nEffects: false,
            I18nMetadataSetter: (file) => ({ ...file, index: false }),
          }
        : {
            I18nEffects: (file) => ({ ...file, index: false }),
          }),
    };
  },
});

export type Adapter = typeof adapterNext;

export default adapterNext;

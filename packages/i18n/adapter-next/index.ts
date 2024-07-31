import { adapterReact } from "../adapter-react";
import { createAdapter } from "../compiler/createAdapter";
import I18nApp from "./generators/I18nApp";
import I18nDocument from "./generators/I18nDocument";
import I18nHead from "./generators/I18nHead";
import I18nLayout from "./generators/I18nLayout";
import I18nLayoutRoot from "./generators/I18nLayoutRoot";
import I18nPage from "./generators/I18nPage";
import I18nSetter from "./generators/I18nSetter";
import i18nGet from "./generators/i18nGet";
import i18nServer from "./generators/i18nServer";
import nextRedirects from "./generators/next-redirects";
import nextRewrites from "./generators/next-rewrites";
import useRouteId from "./generators/useRouteId";
import useTo from "./generators/useTo";
import useToSpa from "./generators/useToSpa";

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
  } as Options,
  getGenerators: (data) => {
    const { router } = data.options.adapter;
    return [
      ...adapterReact.getGenerators(data),
      // TODO: maybe remove these generators, they are useful for debugging for
      // now but probably will be useless
      ...[nextRedirects, nextRewrites],
      useRouteId,
      useTo,
      useToSpa,
      ...(router === "app" || router === "migrating"
        ? [I18nLayout, I18nLayoutRoot, I18nPage, i18nServer]
        : []),
      ...(router === "pages" || router === "migrating"
        ? [I18nSetter, I18nApp, I18nDocument, I18nHead, i18nGet]
        : []),
    ];
  },
  getTransformers: () => {
    return {};
    // example of removing a parent adapter ("react") file from the index
    // return {
    //   getTo: (file) => ({ ...file, index: false }),
    // };
  },
});

export type Adapter = typeof adapterNext;

export default adapterNext;

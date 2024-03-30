import { createAdapter } from "../../compiler/createAdapter";
import type { I18nCompiler } from "../../compiler/types";
import { adapterNextOptions } from "../options";
import I18nAlternates from "./I18nAlternates";
import I18nApp from "./I18nApp";
import I18nHead from "./I18nHead";
import I18nLayout from "./I18nLayout";
import I18nPage from "./I18nPage";
import I18nRoot from "./I18nRoot";
import getI18nMetadata from "./getI18nMetadata";
import i18nProps from "./i18nProps";
import nextRedirects from "./next-redirects";
import nextRewrites from "./next-rewrites";
import useRouteId from "./useRouteId";
import useTo from "./useTo";
import useToSpa from "./useToSpa";

export default createAdapter(adapterNextOptions, ({ adapterOptions }) => {
  const { router } = adapterOptions;
  let files: I18nCompiler.AdapterFile<"next">[] = [
    // TODO: maybe remove these files, they are useful for debugging for now
    // but probably will be useless
    { name: "getI18nMetadata", fn: getI18nMetadata, ext: "ts", index: true },
    { name: "next-redirects", fn: nextRedirects, ext: "js" },
    { name: "next-rewrites", fn: nextRewrites, ext: "js" },
    { name: "useRouteId", fn: useRouteId, ext: "ts", index: true },
    { name: "useTo", fn: useTo, ext: "ts", index: true },
    { name: "useToSpa", fn: useToSpa, ext: "ts", index: true },
  ];

  if (router === "app" || router === "migrating") {
    files = files.concat([
      { name: "I18nLayout", fn: I18nLayout, ext: "tsx", index: true },
      { name: "I18nPage", fn: I18nPage, ext: "tsx", index: true },
      { name: "I18nRoot", fn: I18nRoot, ext: "tsx", index: true },
    ]);
  }

  if (router === "pages" || router === "migrating") {
    files = files.concat([
      { name: "I18nAlternates", fn: I18nAlternates, ext: "tsx", index: true },
      { name: "I18nApp", fn: I18nApp, ext: "tsx", index: true },
      { name: "I18nHead", fn: I18nHead, ext: "tsx", index: true },
      { name: "i18nProps", fn: i18nProps, ext: "ts", index: true },
    ]);
  }

  return {
    dependsOn: ["react"],
    files,
  };
});

import { createAdapter } from "../../compiler/createAdapter";
import type { I18nCompiler } from "../../compiler/types";
import { adapterNextOptions } from "../options";
import getI18nMetadata from "./getI18nMetadata";
import nextRedirects from "./next-redirects";
import nextRewrites from "./next-rewrites";
import useCurrentLocalisedPathnames from "./useCurrentLocalisedPathnames";
// import useLocale from "./useLocale";
import useRouteId from "./useRouteId";
import useTo from "./useTo";
import useToSpa from "./useToSpa";

export default createAdapter(adapterNextOptions, ({}) => {
  return {
    dependsOn: ["react"],
    files: [
      // TODO: maybe remove these files, they are useful for debugging for now
      // but probably will be useless
      { name: "getI18nMetadata", fn: getI18nMetadata, ext: "ts", index: true },
      { name: "next-redirects", fn: nextRedirects, ext: "js" },
      { name: "next-rewrites", fn: nextRewrites, ext: "js" },
      {
        name: "useCurrentLocalisedPathnames",
        fn: useCurrentLocalisedPathnames,
        ext: "ts",
        index: true,
      },
      // { name: "useLocale", fn: useLocale, ext: "ts", index: true },
      { name: "useRouteId", fn: useRouteId, ext: "ts", index: true },
      { name: "useTo", fn: useTo, ext: "ts", index: true },
      { name: "useToSpa", fn: useToSpa, ext: "ts", index: true },
    ] as I18nCompiler.AdapterFile<"next">[],
  };
});

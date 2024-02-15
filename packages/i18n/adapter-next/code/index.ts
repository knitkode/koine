import type { I18nCompiler } from "../../compiler/types";
import nextRedirects from "./next-redirects";
import nextRewrites from "./next-rewrites";
import useCurrentLocalisedPathnames from "./useCurrentLocalisedPathnames";
import useLocale from "./useLocale";
import useRouteId from "./useRouteId";
import useTo from "./useTo";

const adapter: I18nCompiler.AdpaterCreator = () => {
  return {
    dependsOn: ["js"],
    files: [
      // TODO: maybe remove these files, they are useful for debugging for now
      // but probably will be useless
      { name: "next-redirects", fn: nextRedirects, ext: "js" },
      { name: "next-rewrites", fn: nextRewrites, ext: "js" },
      {
        name: "useCurrentLocalisedPathnames",
        fn: useCurrentLocalisedPathnames,
        ext: "ts",
        index: true,
      },
      { name: "useLocale", fn: useLocale, ext: "ts", index: true },
      { name: "useRouteId", fn: useRouteId, ext: "ts", index: true },
      { name: "useTo", fn: useTo, ext: "ts", index: true },
    ],
  };
};

export default adapter;

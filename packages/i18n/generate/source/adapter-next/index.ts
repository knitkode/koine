import type { I18nGenerate } from "../../types";
import nextRedirects from "./next-redirects";
import nextRewrites from "./next-rewrites";
import useCurrentLocalisedPathnames from "./useCurrentLocalisedPathnames";
import useRouteId from "./useRouteId";
import withI18n from "./withI18n";

const adapter: I18nGenerate.Adpater = () => {
  return {
    dependsOn: ["js"],
    files: [
      { name: "next-redirects", fn: nextRedirects, ext: "json" },
      { name: "next-rewrites", fn: nextRewrites, ext: "json" },
      {
        name: "useCurrentLocalisedPathnames",
        fn: useCurrentLocalisedPathnames,
        ext: "ts",
        index: true,
      },
      { name: "useRouteId", fn: useRouteId, ext: "ts", index: true },
      { name: "withI18n", fn: withI18n, ext: "ts" },
    ],
  };
};

export default adapter;

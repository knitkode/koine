import type { I18nCodegen } from "../../codegen";
import nextRedirects from "./next-redirects";
import nextRewrites from "./next-rewrites";
import useCurrentLocalisedPathnames from "./useCurrentLocalisedPathnames";
import useLocale from "./useLocale";
import useRouteId from "./useRouteId";
import useTo from "./useTo";
import withI18n from "./withI18n";

const adapter: I18nCodegen.Adpater = () => {
  return {
    dependsOn: ["js"],
    files: [
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
      { name: "withI18n", fn: withI18n, ext: "js" },
    ],
  };
};

export default adapter;

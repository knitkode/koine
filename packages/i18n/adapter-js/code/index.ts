import { createAdapter } from "../../compiler/createAdapter";
import type { I18nCompiler } from "../../compiler/types";
import { adapterJsOptions } from "../options";
import config from "./config";
import configCjs from "./config.cjs";
import createT from "./createT";
import defaultLocale from "./defaultLocale";
import getI18nAlternates from "./getI18nAlternates";
// import getI18nAlternatesFromDom from "./getI18nAlternatesFromDom";
import getI18nDictionaries from "./getI18nDictionaries";
import getT from "./getT";
import isLocale from "./isLocale";
import loadTranslations from "./loadTranslations";
import locales from "./locales";
import pathnameToRouteId from "./pathnameToRouteId";
import routes from "./routes";
import routesSlim from "./routesSlim";
import routesSpa from "./routesSpa";
import t from "./t";
import tInterpolateParams from "./tInterpolateParams";
import tPluralise from "./tPluralise";
import to from "./to";
import toFns from "./toFns";
import toFormat from "./toFormat";
import toSpa from "./toSpa";
import types from "./types";

export default createAdapter(adapterJsOptions, ({}) => {
  return {
    files: [
      { name: "config.cjs", fn: configCjs, ext: "js" },
      { name: "config", fn: config, ext: "ts", index: true },
      { name: "createT", fn: createT, ext: "ts", index: true },
      { name: "defaultLocale", fn: defaultLocale, ext: "ts", index: true },
      {
        name: "getI18nAlternates",
        fn: getI18nAlternates,
        ext: "ts",
        index: true,
      },
      // TODO: probably remove it or move it to `i18n/client` public utils
      // {
      //   name: "getI18nAlternatesFromDom",
      //   fn: getI18nAlternatesFromDom,
      //   ext: "ts",
      //   index: true,
      // },
      {
        name: "getI18nDictionaries",
        fn: getI18nDictionaries,
        ext: "ts",
        index: true,
      },
      { name: "getT", fn: getT, ext: "ts", index: true },
      { name: "isLocale", fn: isLocale, ext: "ts", index: true },
      { name: "loadTranslations", fn: loadTranslations, ext: "ts" },
      { name: "locales", fn: locales, ext: "ts", index: true },
      {
        name: "pathnameToRouteId",
        fn: pathnameToRouteId,
        ext: "ts",
        index: true,
      },
      { name: "routes", fn: routes, ext: "ts" },
      { name: "routesSlim", fn: routesSlim, ext: "ts" },
      { name: "routesSpa", fn: routesSpa, ext: "ts" },
      { name: "t", fn: t, ext: "ts", index: true },
      {
        name: "tInterpolateParams",
        fn: tInterpolateParams,
        ext: "ts",
      },
      { name: "to", fn: to, ext: "ts", index: true },
      { name: "toFns", fn: toFns, ext: "ts", index: true },
      { name: "toFormat", fn: toFormat, ext: "ts", index: true },
      { name: "toSpa", fn: toSpa, ext: "ts", index: true },
      { name: "tPluralise", fn: tPluralise, ext: "ts" },
      { name: "types", fn: types, ext: "ts", index: true },
    ] as I18nCompiler.AdapterFile<"js">[],
  };
});

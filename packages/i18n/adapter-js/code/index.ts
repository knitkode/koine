import { createAdapter } from "../../compiler/createAdapter";
import { adapterJsOptions } from "../options";
import config from "./config";
import configCjs from "./config.cjs";
import createT from "./createT";
import defaultLocale from "./defaultLocale";
import deriveLocalisedPathnames from "./deriveLocalisedPathnames";
import getAlternates from "./getAlternates";
import getT from "./getT";
import isLocale from "./isLocale";
import loadTranslations from "./loadTranslations";
import locales from "./locales";
import pathnameToRouteId from "./pathnameToRouteId";
import pathnames from "./pathnames";
import routes from "./routes";
import routesSlim from "./routesSlim";
import routesSpa from "./routesSpa";
import tFns from "./tFns";
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
        name: "deriveLocalisedPathnames",
        fn: deriveLocalisedPathnames,
        ext: "ts",
        index: true,
      },
      { name: "getAlternates", fn: getAlternates, ext: "ts", index: true },
      { name: "getT", fn: getT, ext: "ts", index: true },
      { name: "isLocale", fn: isLocale, ext: "ts", index: true },
      { name: "loadTranslations", fn: loadTranslations, ext: "ts" },
      { name: "locales", fn: locales, ext: "ts", index: true },
      { name: "pathnames", fn: pathnames, ext: "ts", index: true },
      {
        name: "pathnameToRouteId",
        fn: pathnameToRouteId,
        ext: "ts",
        index: true,
      },
      { name: "routes", fn: routes, ext: "ts" },
      { name: "routesSlim", fn: routesSlim, ext: "ts" },
      { name: "routesSpa", fn: routesSpa, ext: "ts" },
      { name: "tFns", fn: tFns, ext: "ts" },
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
    ],
  };
});

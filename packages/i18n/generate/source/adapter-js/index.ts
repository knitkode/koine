import type { I18nGenerate } from "../../types";
import config from "./config";
import defaultLocale from "./defaultLocale";
import deriveLocalisedPathnames from "./deriveLocalisedPathnames";
import isLocale from "./isLocale";
import locales from "./locales";
import pathnameToRouteId from "./pathnameToRouteId";
import routes from "./routes";
import routesSlim from "./routesSlim";
import to from "./to";
import toFns from "./toFns";
import toFormat from "./toFormat";
import types from "./types";

const adapter: I18nGenerate.Adpater = () => {
  return {
    files: [
      { name: "config", fn: config, ext: "ts", index: true },
      { name: "defaultLocale", fn: defaultLocale, ext: "ts", index: true },
      {
        name: "deriveLocalisedPathnames",
        fn: deriveLocalisedPathnames,
        ext: "ts",
        index: true,
      },
      { name: "isLocale", fn: isLocale, ext: "ts", index: true },
      { name: "locales", fn: locales, ext: "ts", index: true },
      {
        name: "pathnameToRouteId",
        fn: pathnameToRouteId,
        ext: "ts",
        index: true,
      },
      { name: "routes", fn: routes, ext: "ts", index: true },
      { name: "routesSlim", fn: routesSlim, ext: "ts", index: true },
      { name: "to", fn: to, ext: "ts", index: true },
      { name: "toFns", fn: toFns, ext: "ts", index: true },
      { name: "toFormat", fn: toFormat, ext: "ts", index: true },
      { name: "types", fn: types, ext: "ts", index: true },
    ],
  };
};

export default adapter;

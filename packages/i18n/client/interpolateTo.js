"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interpolateTo = void 0;
const utils_1 = require("@koine/utils");
const formatRoutePathname_1 = require("./formatRoutePathname");
function interpolateTo(
  value, // RouteStrictId<TRouteId>,
  params,
) {
  let pathname = value.replace(/\./g, "/");
  if (process.env["NODE_ENV"] === "development") {
    if (params) {
      pathname.replace(/[[{]{1,2}(.*?)[\]}]{1,2}/g, (_, dynamicKey) => {
        const key = dynamicKey;
        if (!(key in params)) {
          throw new Error(
            "[@koine/i18n]::interpolateTo, using '" +
              value +
              "' without param '" +
              key +
              "'",
          );
        }
        if (!["string", "number"].includes(typeof params[key])) {
          throw new Error(
            "[@koine/i18n]::interpolateTo, using '" +
              value +
              "' with unserializable param  '" +
              key +
              "' (type '" +
              (0, utils_1.getType)(params[key]) +
              "')",
          );
        }
        return "";
      });
    }
  }
  pathname = pathname
    ? params
      ? pathname.replace(
          /[[{]{1,2}(.*?)[\]}]{1,2}/g,
          (_, dynamicKey) => params[dynamicKey.trim()] + "",
        )
      : pathname
    : // special home page case
      "/";
  return (0, formatRoutePathname_1.formatRoutePathname)(pathname);
}
exports.interpolateTo = interpolateTo;
exports.default = interpolateTo;

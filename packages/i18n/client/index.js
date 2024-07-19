"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeHasDynamicPortion =
  exports.interpolateTo =
  exports.formatRoutePathname =
    void 0;
const formatRoutePathname_1 = require("./formatRoutePathname");
Object.defineProperty(exports, "formatRoutePathname", {
  enumerable: true,
  get: function () {
    return formatRoutePathname_1.formatRoutePathname;
  },
});
const interpolateTo_1 = require("./interpolateTo");
Object.defineProperty(exports, "interpolateTo", {
  enumerable: true,
  get: function () {
    return interpolateTo_1.interpolateTo;
  },
});
const routeHasDynamicPortion_1 = require("./routeHasDynamicPortion");
Object.defineProperty(exports, "routeHasDynamicPortion", {
  enumerable: true,
  get: function () {
    return routeHasDynamicPortion_1.routeHasDynamicPortion;
  },
});
// /**
//  * Convert a URL like pathname to a "named route"
//  * E.g. it transforms:
//  * - `/dashboard/user/[id]` into `dashboard.user.[id]`
//  */
// export let pathnameToRouteId = (pathname: string) =>
//   pathname
//     .replace(/^\//g, "")
//     .replace(/\//g, ".")
//     .replace(/\/index$/, "");
// let buildRoutePathname = (
//   obj: object,
//   path: string[] = [],
//   delimiter = ".",
//   values: string[] = [],
// ) => {
//   const firstKey = path[0] as keyof typeof obj;
//   if (typeof obj[firstKey] === "object") {
//     if (obj[firstKey]["index"]) {
//       values.push(obj[firstKey]["index"]);
//     }
//     buildRoutePathname(obj[firstKey], path.slice(1), delimiter, values);
//   } else if (obj[firstKey]) {
//     values.push(obj[firstKey]);
//   }
//   return values.join(delimiter);
// };
// export let buildRoutePathnameUntil = (
//   obj: object,
//   path: string,
//   delimiter = ".",
// ) => {
//   return buildRoutePathname(obj, path.split(delimiter), delimiter);
// };
// export let buildRoutePathnameUntilParent = (
//   obj: object,
//   path: string,
//   delimiter = ".",
// ) =>
//   buildRoutePathname(
//     obj,
//     path.split(delimiter).filter(Boolean).slice(0, -1),
//     delimiter,
//   );

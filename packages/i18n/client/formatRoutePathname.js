"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatRoutePathname = void 0;
const formatRoutePathname = function (pathname, options) {
  if (pathname === void 0) {
    pathname = "";
  }
  const trailingSlash = (options || {}).trailingSlash;
  // first ensure initial and trailing slashes then replaces consecutive slashes
  pathname = ("/" + pathname + "/").replace(/\/+/g, "/");
  // eventually remove the trailing slash
  if (!trailingSlash) {
    pathname = pathname.replace(/\/*$/, "");
  }
  return pathname || "/";
};
exports.formatRoutePathname = formatRoutePathname;
exports.default = exports.formatRoutePathname;

import { __assign } from "tslib";
import { useTheme as _useTheme } from "styled-components";
var DEFAULT_BREAKPOINTS = {
  xs: 0,
  sm: 440,
  md: 768,
  lg: 1024,
  xl: 1368,
  xxl: 1690,
};
/**
 * You can override the default breakpoints through the .env variable
 *
 * FIXME: find a better way to configure it, the problem is that we use the media
 * queries within this pre-compiled library and thrught it was better to avoid
 * using theming props for a more ergonomic usage.
 *
 * ```.env
 * BREAKPOINTS=xs:0,sm:440,md:768,lg:1024,xl:1368,xxl:1690
 * ```
 */
export var breakpoints = process.env["BREAKPOINTS"]
  ? process.env["BREAKPOINTS"].split(",").reduce(function (map, pair) {
      var _a = pair.split(":"),
        key = _a[0],
        value = _a[1];
      map[key] = parseFloat(value);
      return map;
    }, {})
  : DEFAULT_BREAKPOINTS;
var themeDefault = {
  maxWidth: breakpoints.xxl,
  breakpoints: breakpoints,
  devices: {
    mobile: "sm",
    tablet: "md",
    desktop: "lg",
  },
};
export var createTheme = function (options) {
  return __assign(__assign({}, themeDefault), options);
};
export var useTheme = _useTheme;

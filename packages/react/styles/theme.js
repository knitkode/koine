import { useTheme as _useTheme } from "styled-components";
import { __assign, __read } from "tslib";

var DEFAULT_BREAKPOINTS = {
  xs: 0,
  sm: 440,
  md: 768,
  lg: 1024,
  xl: 1368,
  xxl: 1690,
};
export var breakpoints = process.env["BREAKPOINTS"]
  ? process.env["BREAKPOINTS"].split(",").reduce(function (map, pair) {
      var _a = __read(pair.split(":"), 2),
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

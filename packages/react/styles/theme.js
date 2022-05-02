import { useTheme as _useTheme } from "styled-components";
const DEFAULT_BREAKPOINTS = {
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
export const breakpoints = process.env["BREAKPOINTS"]
  ? process.env["BREAKPOINTS"].split(",").reduce((map, pair) => {
      const [key, value] = pair.split(":");
      map[key] = parseFloat(value);
      return map;
    }, {})
  : DEFAULT_BREAKPOINTS;
const themeDefault = {
  maxWidth: breakpoints.xxl,
  breakpoints,
  devices: {
    mobile: "sm",
    tablet: "md",
    desktop: "lg",
  },
};
export const createTheme = (options) =>
  Object.assign(Object.assign({}, themeDefault), options);
export const useTheme = _useTheme;

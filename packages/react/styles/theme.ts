import { useTheme as _useTheme } from "styled-components";

export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

export type Breakpoints = Record<Breakpoint, number>;

const DEFAULT_BREAKPOINTS: Breakpoints = {
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
      const [key, value] = pair.split(":") as [Breakpoint, string];
      map[key] = parseFloat(value);
      return map;
    }, {} as Breakpoints)
  : DEFAULT_BREAKPOINTS;

const themeDefault: Partial<Theme> = {
  maxWidth: breakpoints.xxl,
  breakpoints,
  devices: {
    mobile: "sm",
    tablet: "md",
    desktop: "lg",
  },
};

export const createTheme = (options: ThemeOptions) =>
  ({
    ...themeDefault,
    ...options,
  } as Theme);

export const useTheme = _useTheme as () => Theme;

export type Theme = {
  // export interface Theme {
  maxWidth: number;
  gutter: {
    quarter: number;
    third: number;
    half: number;
    /** @default 60 */
    normal: number;
    double: number;
    triple: number;
  };
  breakpoints: Breakpoints;
  devices: {
    /** @default "sm" */
    mobile: keyof Breakpoints;
    /** @default "md" */
    tablet: keyof Breakpoints;
    /** @default "lg" */
    desktop: keyof Breakpoints;
  };
  spaces: {
    mobile: {
      /** @default 10 */
      sm: number;
      /** @default 20 */
      md: number;
      /** @default 40 */
      lg: number;
    };
    tablet: {
      /** @default 15 */
      sm: number;
      /** @default 30 */
      md: number;
      /** @default 60 */
      lg: number;
    };
    desktop: {
      /** @default 20 */
      sm: number;
      /** @default 40 */
      md: number;
      /** @default 80 */
      lg: number;
    };
  };
  header: {
    /** @default "lg" */
    breakpoint: keyof Breakpoints;
    /** @default [82, 134] */
    height: [number, number];
    /** @default [60, 90] */
    heightSticky: [number, number];
    /** @default [76, 76] */
    logoWidth: [number, number];
    /** @default [70, 70] */
    logoWidthSticky: [number, number];
  };
};

export type ThemeOptions = {
  maxWidth?: number;
  gutter: NonNullable<Theme["gutter"]>;
  devices?: Theme["devices"];
  spaces: NonNullable<Theme["spaces"]>;
  header: NonNullable<Theme["header"]>;
};

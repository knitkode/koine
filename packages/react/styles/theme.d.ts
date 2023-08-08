export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
export type Breakpoints = Record<Breakpoint, number>;
export declare const breakpoints: Breakpoints;
export declare const createTheme: (options: ThemeOptions) => Theme;
export declare const useTheme: () => Theme;
export type Theme = {
  maxWidth: number;
  gutter: {
    quarter: number;
    third: number;
    half: number;
    normal: number;
    double: number;
    triple: number;
  };
  breakpoints: Breakpoints;
  devices: {
    mobile: keyof Breakpoints;
    tablet: keyof Breakpoints;
    desktop: keyof Breakpoints;
  };
  spaces: {
    mobile: {
      sm: number;
      md: number;
      lg: number;
    };
    tablet: {
      sm: number;
      md: number;
      lg: number;
    };
    desktop: {
      sm: number;
      md: number;
      lg: number;
    };
  };
  header: {
    breakpoint: keyof Breakpoints;
    height: [number, number];
    heightSticky: [number, number];
    logoWidth: [number, number];
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

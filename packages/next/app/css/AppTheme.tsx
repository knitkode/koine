import React from "react";
import { AppProps as NextAppProps } from "next/app";
// import { ThemeVanillaProvider, ThemeVanillaValue } from "@koine/react";
import { ThemeProvider, type ThemeProviderProps } from "../../useTheme";

export type AppThemeProps = React.PropsWithChildren<
  NextAppProps & {
    // theme: ThemeVanillaValue;
    theme: ThemeProviderProps["defaultTheme"];
  }
>;

/**
 * App theme with vanilla class based theme (good for `tailwindcss`)
 */
export const AppTheme = ({ theme, children }: AppThemeProps) => {
  // return (
  //   <ThemeVanillaProvider initialTheme={theme}>{children}</ThemeVanillaProvider>
  // );
  return (
    <ThemeProvider defaultTheme={theme} attribute="class">
      {children}
    </ThemeProvider>
  );
};

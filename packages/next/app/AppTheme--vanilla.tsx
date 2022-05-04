import React from "react";
import { AppProps as NextAppProps } from "next/app";
// import { ThemeVanillaProvider, ThemeVanillaValue } from "@koine/react/index.js";
import { ThemeProvider, ThemeProviderProps } from "../Theme/index.js";

export type AppThemeVanillaProps = React.PropsWithChildren<
  NextAppProps & {
    // theme: ThemeVanillaValue;
    theme: ThemeProviderProps["defaultTheme"];
  }
>;

/**
 * App theme with vanilla class based theme (good for `tailwindcss`)
 */
export const AppThemeVanilla: React.FC<AppThemeVanillaProps> = ({
  theme,
  children,
}) => {
  // return (
  //   <ThemeVanillaProvider initialTheme={theme}>{children}</ThemeVanillaProvider>
  // );
  return (
    <ThemeProvider defaultTheme={theme} attribute="class">
      {children}
    </ThemeProvider>
  );
};

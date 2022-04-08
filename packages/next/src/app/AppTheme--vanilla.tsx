import React from "react";
import { AppProps as NextAppProps } from "next/app";
// import { ThemeVanillaProvider, ThemeVanillaValue } from "@koine/react";
import { ThemeProvider, ThemeProviderProps } from "../Theme";

export type AppThemeVanillaProps = NextAppProps & {
  // theme: ThemeVanillaValue;
  theme: ThemeProviderProps["defaultTheme"];
};

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

import { type AppProps as NextAppProps } from "next/app";
import React from "react";
import { ThemeProvider, type ThemeProviderProps } from "../../../ThemeProvider";

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

export default AppTheme;

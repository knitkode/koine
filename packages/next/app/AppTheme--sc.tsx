import React from "react";
import { AppProps as NextAppProps } from "next/app";
import { ThemeProvider } from "styled-components";
import { StylesGlobal, Theme } from "@koine/react/styles/index.js";

export type AppThemeScProps = React.PropsWithChildren<
  NextAppProps & {
    /**
     * A theme object
     */
    theme: Theme;
  }
>;

/**
 * App theme with `styled-components`
 */
export const AppThemeSc: React.FC<AppThemeScProps> = ({ theme, children }) => {
  return (
    <ThemeProvider theme={theme}>
      <StylesGlobal />
      {children}
    </ThemeProvider>
  );
};

import React from "react";
import { AppProps as NextAppProps } from "next/app";
import { ThemeProvider } from "styled-components";
import { StylesGlobal, Theme } from "@koine/react/sc";

export type AppThemeProps = React.PropsWithChildren<
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
export const AppTheme = ({ theme, children }: AppThemeProps) => {
  return (
    <ThemeProvider theme={theme}>
      <StylesGlobal />
      {children}
    </ThemeProvider>
  );
};

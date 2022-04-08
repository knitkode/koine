import { AppProps as NextAppProps } from "next/app";
import { ThemeProvider } from "styled-components";
import { StylesGlobal, Theme } from "@koine/react";

export type AppThemeScProps = NextAppProps & {
  /**
   * A theme object
   */
  theme: Theme;
};

/**
 * App theme with `styled-components`
 */
export const AppThemeSc: React.FC<AppThemeScProps> = ({ theme, children }) => {
  return (
    <>
      <StylesGlobal />
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </>
  );
};

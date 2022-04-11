import React from "react";
import { AppProps as NextAppProps } from "next/app";
import { AppHead } from "./AppHead";
import { AppThemeSc, AppThemeScProps } from "./AppTheme--sc";
import { AppMainSc, AppMainScProps } from "./AppMain--sc";

export type AppScProps = NextAppProps & AppThemeScProps & AppMainScProps;

/**
 * App
 */
export const AppSc: React.FC<AppScProps> = (props) => {
  return (
    <>
      <AppHead />
      <AppThemeSc {...props}>
        <AppMainSc {...props} />
      </AppThemeSc>
    </>
  );
};

export default AppSc;

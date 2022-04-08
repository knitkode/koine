import React from "react";
import { AppProps as NextAppProps } from "next/app";
import { AppHead } from "./AppHead";
import { AppThemeSc, AppThemeScProps } from "./AppTheme--sc";
import { AppMain, AppMainProps } from "./AppMain";

export type AppBaseProps = NextAppProps & AppThemeScProps & AppMainProps;

/**
 * App
 */
export const AppBase: React.FC<AppBaseProps> = (props) => {
  return (
    <React.Fragment>
      <AppHead />
      <AppThemeSc {...props}>
        <AppMain {...props} />
      </AppThemeSc>
    </React.Fragment>
  );
};

export default AppBase;

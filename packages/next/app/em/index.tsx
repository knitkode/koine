import React from "react";
import { AppProps } from "next/app";
import { AppHead } from "../AppHead";
import { AppTheme, AppThemeProps } from "./AppTheme";
import { AppMain, AppMainProps } from "./AppMain";

export type NextAppProps = AppProps & AppThemeProps & AppMainProps;

/**
 * App
 */
export const NextApp = (props: NextAppProps) => {
  return (
    <React.StrictMode>
      <AppHead />
      <AppTheme {...props}>
        <AppMain {...props} />
      </AppTheme>
    </React.StrictMode>
  );
};

export default NextApp;

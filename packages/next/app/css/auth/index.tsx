import React from "react";
import { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { AppHead } from "../../AppHead";
import { AppTheme, AppThemeProps } from "../AppTheme";
import { AppMain, AppMainProps } from "../AppMain";

export type NextAppProps = AppProps & AppThemeProps & AppMainProps;

/**
 * App with authentication provided by `next-auth`
 */
export const NextApp = (props: NextAppProps) => {
  return (
    <React.StrictMode>
      <AppHead />
      <SessionProvider session={props.pageProps.session}>
        <AppTheme {...props}>
          <AppMain {...props} />
        </AppTheme>
      </SessionProvider>
    </React.StrictMode>
  );
};

export default NextApp;

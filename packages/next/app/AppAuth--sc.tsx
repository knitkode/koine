import React from "react";
import { AppProps as NextAppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { AppHead } from "./AppHead.js";
import { AppThemeSc, AppThemeScProps } from "./AppTheme--sc.js";
import { AppMainSc, AppMainScProps } from "./AppMain--sc.js";

export type AppAuthScProps = NextAppProps & AppThemeScProps & AppMainScProps;

/**
 * App with authentication provided by `next-auth`
 */
export const AppAuthSc: React.FC<AppAuthScProps> = (props) => {
  return (
    <React.StrictMode>
      <AppHead />
      <SessionProvider session={props.pageProps.session}>
        <AppThemeSc {...props}>
          <AppMainSc {...props} />
        </AppThemeSc>
      </SessionProvider>
    </React.StrictMode>
  );
};

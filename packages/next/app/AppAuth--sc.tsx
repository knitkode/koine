import React from "react";
import { AppProps as NextAppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { AppHead } from "./AppHead";
import { AppThemeSc, AppThemeScProps } from "./AppTheme--sc";
import { AppMainSc, AppMainScProps } from "./AppMain--sc";

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

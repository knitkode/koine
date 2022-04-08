import React from "react";
import { AppProps as NextAppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { AppHead } from "./AppHead";
import { AppThemeSc, AppThemeScProps } from "./AppTheme--sc";
import { AppMain, AppMainProps } from "./AppMain";

export type AppAuthScProps = NextAppProps & AppThemeScProps & AppMainProps;

/**
 * App with authentication provided by `next-auth`
 */
export const AppAuthSc: React.FC<AppAuthScProps> = (props) => {
  return (
    <SessionProvider session={props.pageProps.session}>
      <AppHead />
      <AppThemeSc {...props}>
        <AppMain {...props} />
      </AppThemeSc>
    </SessionProvider>
  );
};

export default AppAuthSc;

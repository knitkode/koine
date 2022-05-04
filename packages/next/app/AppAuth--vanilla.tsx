import React from "react";
import { AppProps as NextAppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { AppHead } from "./AppHead.js";
import { AppThemeVanilla, AppThemeVanillaProps } from "./AppTheme--vanilla.js";
import { AppMainVanilla, AppMainVanillaProps } from "./AppMain--vanilla.js";

export type AppAuthVanillaProps = NextAppProps &
  AppThemeVanillaProps &
  AppMainVanillaProps;

/**
 * App with authentication provided by `next-auth`
 */
export const AppAuthVanilla: React.FC<AppAuthVanillaProps> = (props) => {
  return (
    <React.StrictMode>
      <AppHead />
      <SessionProvider session={props.pageProps.session}>
        <AppThemeVanilla {...props}>
          <AppMainVanilla {...props} />
        </AppThemeVanilla>
      </SessionProvider>
    </React.StrictMode>
  );
};

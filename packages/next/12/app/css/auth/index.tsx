import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { AppHead } from "../../AppHead";
import { AppMain, type AppMainProps } from "../AppMain";
import { AppTheme, type AppThemeProps } from "../AppTheme";

export type NextAppProps = AppProps<{ session: any }> &
  AppThemeProps &
  AppMainProps;

/**
 * App with authentication provided by `next-auth`
 */
export const NextApp = (props: NextAppProps) => {
  return (
    <>
      <AppHead />
      <SessionProvider session={props.pageProps.session}>
        <AppTheme {...props}>
          <AppMain {...props} />
        </AppTheme>
      </SessionProvider>
    </>
  );
};

export default NextApp;

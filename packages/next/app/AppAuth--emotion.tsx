import React from "react";
import { AppProps as NextAppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { AppHead } from "./AppHead";
import { AppThemeEmotion, AppThemeEmotionProps } from "./AppTheme--emotion";
import { AppMainEmotion, AppMainEmotionProps } from "./AppMain--emotion";

export type AppAuthEmotionProps = NextAppProps &
  AppThemeEmotionProps &
  AppMainEmotionProps;

/**
 * App with authentication provided by `next-auth`
 */
export const AppAuthEmotion: React.FC<AppAuthEmotionProps> = (props) => {
  return (
    <>
      <AppHead />
      <SessionProvider session={props.pageProps.session}>
        <AppThemeEmotion {...props}>
          <AppMainEmotion {...props} />
        </AppThemeEmotion>
      </SessionProvider>
    </>
  );
};

export default AppAuthEmotion;

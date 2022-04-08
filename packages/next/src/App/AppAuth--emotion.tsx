import { AppProps as NextAppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { AppHead } from "./AppHead";
import { AppThemeEmotion, AppThemeEmotionProps } from "./AppTheme--emotion";
import { AppMain, AppMainProps } from "./AppMain";

export type AppAuthEmotionProps = NextAppProps &
  AppThemeEmotionProps &
  AppMainProps;

/**
 * App with authentication provided by `next-auth`
 */
export const AppAuthEmotion: React.FC<AppAuthEmotionProps> = (props) => {
  return (
    <>
      <AppHead />
      <SessionProvider session={props.pageProps.session}>
        <AppThemeEmotion {...props}>
          <AppMain {...props} />
        </AppThemeEmotion>
      </SessionProvider>
    </>
  );
};

export default AppAuthEmotion;

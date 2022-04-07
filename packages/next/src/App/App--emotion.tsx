import { FC } from "react";
import { AppProps as NextAppProps } from "next/app";
import { AppHead } from "./AppHead";
import { AppThemeEmotion, AppThemeEmotionProps } from "./AppTheme--emotion";
import { AppMain, AppMainProps } from "./AppMain";

export type AppEmotionProps = NextAppProps &
  AppThemeEmotionProps &
  AppMainProps;

/**
 * App
 */
export const AppEmotion: FC<AppEmotionProps> = (props) => {
  return (
    <>
      <AppHead />
      <AppThemeEmotion {...props}>
        <AppMain {...props} />
      </AppThemeEmotion>
    </>
  );
};

export default AppEmotion;

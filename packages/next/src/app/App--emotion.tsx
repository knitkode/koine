import React from "react";
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
export const AppEmotion: React.FC<AppEmotionProps> = (props) => {
  return (
    <React.Fragment>
      <AppHead />
      <AppThemeEmotion {...props}>
        <AppMain {...props} />
      </AppThemeEmotion>
    </React.Fragment>
  );
};

export default AppEmotion;

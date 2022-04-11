import React from "react";
import { AppProps as NextAppProps } from "next/app";
import { AppHead } from "./AppHead";
import { AppThemeEmotion, AppThemeEmotionProps } from "./AppTheme--emotion";
import { AppMainEmotion, AppMainEmotionProps } from "./AppMain--emotion";

export type AppEmotionProps = NextAppProps &
  AppThemeEmotionProps &
  AppMainEmotionProps;

/**
 * App
 */
export const AppEmotion: React.FC<AppEmotionProps> = (props) => {
  return (
    <>
      <AppHead />
      <AppThemeEmotion {...props}>
        <AppMainEmotion {...props} />
      </AppThemeEmotion>
    </>
  );
};

export default AppEmotion;

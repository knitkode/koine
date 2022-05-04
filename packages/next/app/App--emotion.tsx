import React from "react";
import { AppProps as NextAppProps } from "next/app";
import { AppHead } from "./AppHead.js";
import { AppThemeEmotion, AppThemeEmotionProps } from "./AppTheme--emotion.js";
import { AppMainEmotion, AppMainEmotionProps } from "./AppMain--emotion.js";

export type AppEmotionProps = NextAppProps &
  AppThemeEmotionProps &
  AppMainEmotionProps;

/**
 * App
 */
export const AppEmotion: React.FC<AppEmotionProps> = (props) => {
  return (
    <React.StrictMode>
      <AppHead />
      <AppThemeEmotion {...props}>
        <AppMainEmotion {...props} />
      </AppThemeEmotion>
    </React.StrictMode>
  );
};

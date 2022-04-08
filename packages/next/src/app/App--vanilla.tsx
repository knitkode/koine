import React from "react";
import { AppProps as NextAppProps } from "next/app";
import { AppHead } from "./AppHead";
import { AppThemeVanilla, AppThemeVanillaProps } from "./AppTheme--vanilla";
import { AppMainVanilla, AppMainVanillaProps } from "./AppMain--vanilla";

export type AppVanillaProps = NextAppProps &
  AppThemeVanillaProps &
  AppMainVanillaProps;

/**
 * App
 */
export const AppVanilla: React.FC<AppVanillaProps> = (props) => {
  return (
    <React.Fragment>
      <AppHead />
      <AppThemeVanilla {...props}>
        <AppMainVanilla {...props} />
      </AppThemeVanilla>
    </React.Fragment>
  );
};

export default AppVanilla;

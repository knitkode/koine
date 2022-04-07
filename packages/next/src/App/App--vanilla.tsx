import { FC } from "react";
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
export const AppVanilla: FC<AppVanillaProps> = (props) => {
  return (
    <>
      <AppHead />
      <AppThemeVanilla {...props}>
        <AppMainVanilla {...props} />
      </AppThemeVanilla>
    </>
  );
};

export default AppVanilla;

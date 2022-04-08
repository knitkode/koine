import { AppProps as NextAppProps } from "next/app";
import { AppHead } from "./AppHead";
import { AppThemeSc, AppThemeScProps } from "./AppTheme--sc";
import { AppMain, AppMainProps } from "./AppMain";

export type AppBaseProps = NextAppProps & AppThemeScProps & AppMainProps;

/**
 * App
 */
export const AppBase: React.FC<AppBaseProps> = (props) => {
  return (
    <>
      <AppHead />
      <AppThemeSc {...props}>
        <AppMain {...props} />
      </AppThemeSc>
    </>
  );
};

export default AppBase;

import { AppProps } from "next/app";
import { AppHead } from "../AppHead";
import { AppTheme, AppThemeProps } from "./AppTheme";
import { AppMain, AppMainProps } from "./AppMain";

export type NextAppProps = AppProps & AppThemeProps & AppMainProps;

/**
 * App
 */
export const NextApp = (props: NextAppProps) => {
  return (
    <>
      <AppHead />
      <AppTheme {...props}>
        <AppMain {...props} />
      </AppTheme>
    </>
  );
};

export default NextApp;

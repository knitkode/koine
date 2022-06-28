import { AppProps } from "next/app";
import { AppHead } from "../AppHead";
import { AppTheme, AppThemeProps } from "./AppTheme";
import { AppMain, AppMainProps } from "./AppMain";

export type NextAppProps = AppProps & AppThemeProps & AppMainProps;

/**
 * App
 *
 * @example
 *
 * ```tsx
 * import { NextApp, NextAppProps } from "@koine/next/app/sc/auth";
 * import { Favicon, AnalyticsGoogle } from "@koine/next";
 * import { theme } from "src/helpers/theme";
 * import { Layout, ProgressOverlay } from "src/components/Layout";
 * // import "@fontsource/myfont/800.css";
 * // import "src/helpers/theme.css";
 *
 * const motion = () => import("@koine/react/m/max").then((m) => m.default);
 *
 * export default function App(props: NextAppProps) {
 *   return (
 *     <NextApp
 *       {...props}
 *       Layout={Layout}
 *       ProgressOverlay={ProgressOverlay}
 *       theme={theme}
 *       motion={motion}
 *       seo={{
 *         titleTemplate: "%s | MyApp",
 *         defaultTitle: "MyApp",
 *         openGraph: {
 *           type: "website",
 *           locale: "en_US",
 *           url: "https://myapp.com/",
 *           site_name: "MyApp",
 *         },
 *         twitter: {
 *           handle: "@MklrNl",
 *           site: "@MyApp",
 *           cardType: "summary_large_image",
 *         },
 *       }}
 *       pre={
 *         <>
 *           <AnalyticsGoogle id="UA-xxxxxxxx-x" />
 *           <Favicon name="MyApp" color="#000000" />
 *         </>
 *       }
 *     />
 *   );
 * }
 *
 * ```
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

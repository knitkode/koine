import React from "react";
import { AppProps as NextAppProps } from "next/app";
import { AppHead } from "./AppHead";
import { AppThemeSc, AppThemeScProps } from "./AppTheme--sc";
import { AppMainSc, AppMainScProps } from "./AppMain--sc";

export type AppScProps = NextAppProps & AppThemeScProps & AppMainScProps;

/**
 * App
 *
 * @example
 *
 * ```tsx
 * import {
 *   AppAuthSc,
 *   AppAuthScProps,
 *   Favicon,
 *   AnalyticsGoogle,
 * } from "@koine/next";
 * import { theme } from "src/helpers/theme";
 * import { Layout, ProgressOverlay } from "src/components/Layout";
 * // import "@fontsource/myfont/800.css";
 * // import "src/helpers/theme.css";
 *
 * const motion = () => import("@koine/react/m/max").then((m) => m.default);
 *
 * export default function App(props: AppAuthScProps) {
 *   return (
 *     <AppAuthSc
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
export const AppSc: React.FC<AppScProps> = (props) => {
  return (
    <React.StrictMode>
      <AppHead />
      <AppThemeSc {...props}>
        <AppMainSc {...props} />
      </AppThemeSc>
    </React.StrictMode>
  );
};

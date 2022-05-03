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
 *
 * @example
 *
 * ```tsx
 * import {
 *   AppVanilla,
 *   AppVanillaProps,
 *   Favicon,
 *   AnalyticsGoogle,
 * } from "@koine/next";
 * import { theme } from "src/helpers/theme";
 * import { Layout } from "src/components/Layout";
 * // import "@fontsource/myfont/800.css";
 * // import "src/helpers/theme.css";
 *
 * const motion = () => import("@koine/react/m/max").then((m) => m.default);
 *
 * export default function App(props: AppVanillaProps) {
 *   return (
 *     <AppVanilla
 *       {...props}
 *       Layout={Layout}
 *       theme={theme}
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
export const AppVanilla: React.FC<AppVanillaProps> = (props) => {
  return (
    <React.StrictMode>
      <AppHead />
      <AppThemeVanilla {...props}>
        <AppMainVanilla {...props} />
      </AppThemeVanilla>
    </React.StrictMode>
  );
};

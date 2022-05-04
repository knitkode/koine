import React from "react";
import { AppProps as NextAppProps } from "next/app";
import { AppHead } from "./AppHead.js";
import { AppThemeVanilla, AppThemeVanillaProps } from "./AppTheme--vanilla.js";
import { AppMainVanilla, AppMainVanillaProps } from "./AppMain--vanilla.js";

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
 * } from "@koine/next/index.js";
 * import { theme } from "src/helpers/theme";
 * import { Layout } from "src/components/Layout";
 * // import "@fontsource/myfont/800.css.js";
 * // import "src/helpers/theme.css.js";
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

import React from "react";
import { SeoDefaults } from "../Seo/index.js";
import type { AppMainBaseProps } from "./AppMain.js";

export type AppMainVanillaProps = Omit<AppMainBaseProps, "ProgressOverlay">;

/**
 * App main
 *
 * It does not imply any specific styling or animation solution
 */
export const AppMainVanilla: React.FC<AppMainVanillaProps> = ({
  Component,
  pageProps,
  Layout,
  seo,
  pre,
  post,
}) => {
  return (
    <React.Fragment>
      <SeoDefaults {...seo} />
      {pre}
      <Layout>
        <Component {...pageProps} />
      </Layout>
      {post}
    </React.Fragment>
  );
};

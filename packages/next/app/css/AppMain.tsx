import React from "react";
import { SeoDefaults } from "../../Seo";
import type { AppMainBaseProps } from "../AppMain";

export type AppMainProps = Omit<AppMainBaseProps, "ProgressOverlay">;

/**
 * App main
 *
 * It does not imply any specific styling or animation solution
 */
export const AppMain = ({
  Component,
  pageProps,
  Layout,
  seo,
  pre,
  post,
}: AppMainProps) => {
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

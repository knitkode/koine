import React from "react";
import { AppProps as NextAppProps } from "next/app";
import { SeoDefaults, SeoDefaultsProps } from "../Seo";

export type AppMainVanillaProps = NextAppProps & {
  /**
   * A wrapping layout component
   */
  Layout: React.FC<Record<string, unknown>>;
  /**
   * Seo site wide default configuration
   */
  seo?: SeoDefaultsProps;
  /**
   * JSX to render just after SEO
   */
  pre?: React.ReactNode;
  /**
   * JSX to render just at the end of the markup
   */
  post?: React.ReactNode;
};

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

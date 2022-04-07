import { FC, ReactNode } from "react";
import { AppProps as NextAppProps } from "next/app";
import { SeoDefaults, SeoDefaultsProps } from "../Seo";

export type AppMainVanillaProps = NextAppProps & {
  /**
   * A wrapping layout component
   */
  Layout: FC<Record<string, unknown>>;
  /**
   * Seo site wide default configuration
   */
  seo?: SeoDefaultsProps;
  /**
   * JSX to render just after SEO
   */
  pre?: ReactNode;
  /**
   * JSX to render just at the end of the markup
   */
  post?: ReactNode;
};

/**
 * App main
 *
 * It does not imply any specific styling or animation solution
 */
export const AppMainVanilla: FC<AppMainVanillaProps> = ({
  Component,
  pageProps,
  Layout,
  seo,
  pre,
  post,
}) => {
  return (
    <>
      <SeoDefaults {...seo} />
      {pre}
      <Layout>
        <Component {...pageProps} />
      </Layout>
      {post}
    </>
  );
};

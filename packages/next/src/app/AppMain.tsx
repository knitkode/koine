import React from "react";
import { AppProps as NextAppProps } from "next/app";
import { useRouter } from "next/router";
import { AnimatePresence, LazyMotion, m, HTMLMotionProps } from "framer-motion";
import { SeoDefaults, SeoDefaultsProps } from "../Seo";
import { NextProgress } from "../NextProgress";

/**
 * @see https://www.framer.com/docs/guide-reduce-bundle-size/
 */
const loadMotionFeatures = () =>
  import("./motion-features").then((m) => m.default);

export type AppMainProps = NextAppProps & {
  /**
   * A wrapping layout component
   */
  Layout: React.FC<Record<string, unknown>>;
  /**
   * Seo site wide default configuration
   */
  seo?: SeoDefaultsProps;
  /**
   * It defaults to fade in/out
   */
  transition?: Omit<HTMLMotionProps<"div">, "key">;
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
 * It implies a setup for `styled-components` and `framer-motion` libraries.
 *
 * About the page transition [wallis' blog post](https://wallis.dev/blog/nextjs-page-transitions-with-framer-motion)
 */
export const AppMain: React.FC<AppMainProps> = ({
  Component,
  pageProps,
  Layout,
  // theme,
  seo,
  transition = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  pre,
  post,
}) => {
  const { pathname } = useRouter();

  return (
    <LazyMotion features={loadMotionFeatures}>
      <SeoDefaults {...seo} />
      {pre}
      <NextProgress />
      <Layout>
        <AnimatePresence exitBeforeEnter initial={false}>
          <m.div key={pathname} {...transition}>
            <Component {...pageProps} key={pathname} />
          </m.div>
        </AnimatePresence>
      </Layout>
      {post}
    </LazyMotion>
  );
};

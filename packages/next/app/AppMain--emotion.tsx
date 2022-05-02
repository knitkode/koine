import React from "react";
import { useRouter } from "next/router";
import { AnimatePresence, LazyMotion, m } from "framer-motion";
import { SeoDefaults } from "../Seo";
import { NextProgress } from "../NextProgress";
import { AppMainBaseProps } from "./AppMain";

/**
 * @see https://www.framer.com/docs/guide-reduce-bundle-size/
 */
const loadMotionFeatures = () =>
  import("./motion-features").then((m) => m.default);

export type AppMainEmotionProps = AppMainBaseProps & {};

/**
 * App main
 *
 * It implies a setup for `styled-components` and `framer-motion` libraries.
 *
 * About the page transition [wallis' blog post](https://wallis.dev/blog/nextjs-page-transitions-with-framer-motion)
 */
export const AppMainEmotion: React.FC<AppMainEmotionProps> = ({
  Component,
  pageProps,
  Layout,
  ProgressOverlay,
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
    <>
      <SeoDefaults {...seo} />
      {pre}
      <LazyMotion features={loadMotionFeatures}>
        {ProgressOverlay && <NextProgress Overlay={ProgressOverlay} />}
        <Layout>
          <AnimatePresence exitBeforeEnter initial={false}>
            <m.div key={pathname} {...transition}>
              <Component {...pageProps} key={pathname} />
            </m.div>
          </AnimatePresence>
        </Layout>
      </LazyMotion>
      {post}
    </>
  );
};

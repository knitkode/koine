import { AnimatePresence, m } from "framer-motion";
import { useRouter } from "next/router";
import React from "react";
import { MotionProvider } from "@koine/react/m";
import { NextProgress } from "../../NextProgress";
import { SeoDefaults } from "../../SeoDefaults";
import type { AppMainBaseProps, AppMainFramerProps } from "../AppMain";

export type AppMainProps = AppMainBaseProps & AppMainFramerProps;

/**
 * App main
 *
 * It implies a setup for `styled-components` and `framer-motion` libraries.
 *
 * About the page transition [wallis' blog post](https://wallis.dev/blog/nextjs-page-transitions-with-framer-motion)
 */
export const AppMain = ({
  Component,
  pageProps,
  Layout,
  ProgressOverlay,
  seo,
  motion,
  transition = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  pre,
  post,
}: AppMainProps) => {
  const { pathname } = useRouter();

  return (
    <>
      <SeoDefaults {...seo} />
      {pre}
      <MotionProvider features={motion}>
        {ProgressOverlay && <NextProgress Overlay={ProgressOverlay} />}
        <Layout>
          <AnimatePresence exitBeforeEnter initial={false}>
            <m.div key={pathname} {...transition}>
              <Component {...pageProps} key={pathname} />
            </m.div>
          </AnimatePresence>
        </Layout>
      </MotionProvider>
      {post}
    </>
  );
};

export default AppMain;

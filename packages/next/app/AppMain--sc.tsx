import React from "react";
import { useRouter } from "next/router";
import { AnimatePresence, m } from "framer-motion";
import { MotionProvider } from "@koine/react/m/index.js";
import { SeoDefaults } from "../Seo/index.js";
import { NextProgress } from "../NextProgress/index.js";
import type { AppMainBaseProps, AppMainFramerProps } from "./AppMain.js";

export type AppMainScProps = AppMainBaseProps & AppMainFramerProps;

/**
 * App main
 *
 * It implies a setup for `styled-components` and `framer-motion` libraries.
 *
 * About the page transition [wallis' blog post](https://wallis.dev/blog/nextjs-page-transitions-with-framer-motion)
 */
export const AppMainSc: React.FC<AppMainScProps> = ({
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
}) => {
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

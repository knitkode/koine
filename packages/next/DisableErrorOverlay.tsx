import Head from "next/head";

/**
 * Disable error overlay during `dev`
 *
 * @see https://github.com/vercel/next.js/discussions/13387#discussioncomment-101564
 */
export const DisableErrorOverlay = () => {
  return (
    <Head>
      {process.env.NODE_ENV !== "production" && (
        <script
          dangerouslySetInnerHTML={{
            __html: `window.addEventListener('error',event =>{event.stopImmediatePropagation()});window.addEventListener('unhandledrejection',event =>{event.stopImmediatePropagation()});`,
          }}
        />
      )}
    </Head>
  );
};

export default DisableErrorOverlay;

import Head from "next/head";
import React from "react";

export type AppHeadProps = unknown;

export const AppHead = () => {
  return (
    <Head>
      <meta name="viewport" content="width=device-width" />
    </Head>
  );
};

export default AppHead;

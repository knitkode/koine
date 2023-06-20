import Head from "next/head";
import React from "react";
import FaviconTags, { type FaviconTagsProps } from "@koine/react/FaviconTags";

export type FaviconProps = FaviconTagsProps;

export const Favicon = (props: FaviconTagsProps) => (
  <Head>
    <FaviconTags {...props} />
  </Head>
);

export default Favicon;

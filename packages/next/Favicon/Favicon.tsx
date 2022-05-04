import React from "react";
import Head from "next/head";
import { FaviconTags, FaviconTagsProps } from "@koine/react/index.js";

export type FaviconProps = FaviconTagsProps;

export const Favicon = (props: FaviconTagsProps) => (
  <Head>
    <FaviconTags {...props} />
  </Head>
);

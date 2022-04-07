import Head from "next/head";
import { FaviconTags, FaviconTagsProps } from "@koine/react";

export type FaviconProps = FaviconTagsProps;

export const Favicon = (props: FaviconTagsProps) => (
  <Head>
    <FaviconTags {...props} />
  </Head>
);

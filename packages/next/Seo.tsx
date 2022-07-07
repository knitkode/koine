import { memo } from "react";
import Head from "next/head";
import type { NextSeoProps } from "next-seo/lib/types";
import type { SeoData } from "./types-seo";
import { seoBuildTags } from "./seoBuildTags";

type SeoPropsOpenGraph = NextSeoProps["openGraph"] & {
  image?: string;
};

/**
 * @see https://github.com/garmeeh/next-seo/blob/master/src/types.ts#L395
 */
export type SeoProps = Omit<
  NextSeoProps,
  | "additionalMetaTags"
  | "additionalLinkTags"
  | "mobileAlternate"
  | "robotsProps"
> & {
  metaTags?: NextSeoProps["additionalMetaTags"];
  linkTags?: NextSeoProps["additionalLinkTags"];
  seo?: SeoData;
  hidden?: SeoData["hidden"];
  keywords?: SeoData["keywords"];
  openGraph?: SeoPropsOpenGraph;
  og?: SeoPropsOpenGraph;
};

const _Seo = (props: SeoProps) => {
  return <Head>{seoBuildTags(props)}</Head>;
};

/**
 * Adapted from [garmeeh/next-seo](https://github.com/garmeeh/next-seo)
 *
 * See also:
 * - https://github.com/catnose99/next-head-seo
 * - https://nextjs.org/docs/api-reference/next/head
 */
export const Seo = memo(_Seo);

export default Seo;

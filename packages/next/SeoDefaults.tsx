// import { memo } from "react";
import Head from "next/head";
import type { DefaultSeoProps } from "next-seo/lib/types";
// import { useRouter } from "next/router";
// import { getSiteUrl } from "../utils";
import { seoBuildTags, type MetaTag, type LinkTag } from "./seoBuildTags";

/**
 * @see https://github.com/garmeeh/next-seo/blob/master/src/types.ts#L413
 */
export type SeoDefaultsProps = Omit<
  DefaultSeoProps,
  | "additionalMetaTags"
  | "additionalLinkTags"
  | "dangerouslySetAllPagesToNoIndex"
  | "dangerouslySetAllPagesToNoFollow"
  | "defaultOpenGraphImageWidth"
  | "defaultOpenGraphImageHeight"
  | "defaultOpenGraphVideoWidth"
  | "defaultOpenGraphVideoHeight"
  | "mobileAlternate"
  | "robotsProps"
> & {
  metaTags?: ReadonlyArray<MetaTag>;
  linkTags?: ReadonlyArray<LinkTag>;
};

export const SeoDefaults = (props: SeoDefaultsProps) => {
  // const router = useRouter();
  // props.openGraph.url = getSiteUrl(router.asPath);
  return <Head>{seoBuildTags(props)}</Head>;
};

export default SeoDefaults;

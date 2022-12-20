import { memo, useId } from "react";
import Head from "next/head";
import type { NextSeoProps } from "next-seo/lib/types";
import type { SeoData } from "./types-seo";
import { seoBuildTags, type MetaTag, type LinkTag } from "./seoBuildTags";

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
  metaTags?: ReadonlyArray<MetaTag>;
  linkTags?: ReadonlyArray<LinkTag>;
  seo?: SeoData;
  hidden?: SeoData["hidden"];
  keywords?: SeoData["keywords"];
  openGraph?: SeoPropsOpenGraph;
  og?: SeoPropsOpenGraph;
};

const _Seo = (props: SeoProps) => {
  const id = useId();
  return <Head>{seoBuildTags(props, "seo-" + id + "-")}</Head>;
};

/**
 * Adapted from [garmeeh/next-seo](https://github.com/garmeeh/next-seo)
 *
 * See also:
 * - https://github.com/catnose99/next-head-seo
 * - https://nextjs.org/docs/api-reference/next/head
 *
 * NB: on the homepage you usually want to customize the `titleTemplate` to avoid
 * doubled app name. Assuming your default seo configuration is something like:
 *
 * ```js
 * {
 *   titleTemplate: "%s | MyApp"
 * }
 * ```
 *
 * On the homepage you migh want to override it, e.g.:
 * ```js
 * <Seo title="MyApp | Some description" titleTemplate="%s" />
 * ```
 */
export const Seo = memo(_Seo);

export default Seo;

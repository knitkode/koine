import { memo } from "react";
import Head from "next/head";
// import { useRouter } from "next/router";
// import { getSiteUrl } from "../utils";

import { buildTags, SeoDefaultsProps } from "./helpers";

const _SeoDefaults = (props: SeoDefaultsProps) => {
  // const router = useRouter();
  // props.openGraph.url = getSiteUrl(router.asPath);
  return <Head>{buildTags(props)}</Head>;
};

export const SeoDefaults = memo(_SeoDefaults);

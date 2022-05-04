import React, { memo } from "react";
import Head from "next/head";
import { buildTags, SeoProps } from "./helpers.js";

const _Seo = (props: SeoProps) => {
  return <Head>{buildTags(props)}</Head>;
};

export const Seo = memo(_Seo);

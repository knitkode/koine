import { createGenerator } from "../../../compiler/createAdapter";

export default createGenerator("next", (_arg) => {
  return {
    I18nSetter: {
      name: "I18nSetter",
      ext: "tsx",
      index: true,
      content: () => /* j s */ `
"use client";

import React, { useContext, useEffect } from "react";
import { getI18nMetadata } from "./internal/getI18nMetadata";
import { I18nHead } from "./internal/I18nHead";
import { I18nMetadataContext } from "./internal/I18nMetadataContext";
import type { I18n } from "./types";
import { useLocale } from "./useLocale";

export type I18nSetterProps<TRouteId extends I18n.RouteId> = {
  route: I18n.RouteArgs<TRouteId>;
};

/**
 * **For Pages Router only**
 * 
 * Use this in in order to update the alternates and canonical URLs.
 * This is _required_ in all pages in order to update the data during navigation.
 * 
 * This need is particularly evident with dynamic routes pages that use
 * \`fallback: true\` as the initial SSR does not have any useful i18n information
 * available. In those page be sure to render this component when the dynamic
 * data is ready, in other words when the pages router is not in fallback state
 * anymore: \`useRouter().isFallback === false\`.
 */
export const I18nSetter = <TRouteId extends I18n.RouteId>(
  props: I18nSetterProps<TRouteId>,
) => {
  const { route } = props;
  const locale = useLocale();
  const [metadata, setMetadata] = useContext(I18nMetadataContext);

  useEffect(() => {
    setMetadata(getI18nMetadata({ locale, ...route }));
  }, [locale, route, setMetadata]);

  return (
    <I18nHead metadata={metadata} />
  );
};

export default I18nSetter;
`,
    },
  };
});

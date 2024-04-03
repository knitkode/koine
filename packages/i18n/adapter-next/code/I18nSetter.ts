import type { I18nCompiler } from "../../compiler/types";

export default ({ config: { single } }: I18nCompiler.AdapterArg<"next">) => `
"use client";

import { useContext, useEffect } from "react";
import { I18nMetadataContext } from "./I18nMetadataContext";
import { I18nHead } from "./I18nHead";
import { getI18nMetadata } from "./getI18nMetadata";
import type { I18n } from "./types";
import { useLocale } from "./useLocale";

export type I18nSetterProps<TRouteId extends I18n.RouteId> =
  I18n.RouteArgs<TRouteId>;

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
  const { id, params } = props;
  const locale = useLocale();
  const [metadata, setMetadata] = useContext(I18nMetadataContext);

  useEffect(() => {
    // @ts-expect-error FIXME: route conditional type
    setMetadata(getI18nMetadata({ locale, id, params }));
  }, [id, params, locale, setMetadata]);

  return (
    <I18nHead metadata={metadata} />
  );
};

export default I18nSetter;
`;

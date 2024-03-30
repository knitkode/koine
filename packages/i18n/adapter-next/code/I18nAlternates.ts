import type { I18nCompiler } from "../../compiler/types";

export default ({}: I18nCompiler.AdapterArg<"next">) => `
"use client";

import { useContext, useEffect } from "react";
import { I18nAlternatesContext } from "./I18nAlternatesContext";
import { I18nHead } from "./I18nHead";
import { getAlternates } from "./getAlternates";
import type { I18n } from "./types";
import { useLocale } from "./useLocale";

export type I18nAlternatesProps<TRouteId extends I18n.RouteId> =
  I18n.RouteArgs<TRouteId>;

/**
 * Use this in dynamic routes pages that use \`fallback: true\` in order to update
 * the alternates once the data that populate the URL params is ready.
 * 
 * **For Pages Router only**
 */
export const I18nAlternates = <TRouteId extends I18n.RouteId>(
  props: I18nAlternatesProps<TRouteId>,
) => {
  const { id, params } = props;
  const locale = useLocale();
  const [alternates, setAlternates] = useContext(I18nAlternatesContext);

  useEffect(() => {
    setAlternates(getAlternates({ locale, id, params }));
  }, [id, params, locale, setAlternates]);

  return <I18nHead alternates={alternates} />;
};

export default I18nAlternates;
`;

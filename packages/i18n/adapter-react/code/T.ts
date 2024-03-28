import type { I18nCompiler } from "../../compiler/types";

export default ({}: I18nCompiler.AdapterArg<"react">) => `
"use client";

import { useMemo } from "react";
import { formatElements } from "./formatElements";
import type { I18n } from "./types";
import { useT } from "./useT";

export type TProps = {
  i18nKey: I18n.TranslationsAllPaths;
  components?: React.ReactElement[] | Record<string, React.ReactElement>;
  values?: I18n.TranslationQuery;
  returnObjects?: boolean;
};

/**
 * Translate transforming:
 * <0>This is an <1>example</1><0>
 * to -> <h1>This is an <b>example</b><h1>
 */
export const T = ({
  i18nKey,
  values,
  components,
  returnObjects,
}: TProps) => {
  const [namespace, path] = (i18nKey as string).split(":");
  const t = useT(namespace as I18n.TranslateNamespace) as I18n.TranslateLoose;
  const result = useMemo(() => {
    const text = t(path, values, {
      returnObjects,
    });

    if (!text) return text;

    if (!components || components.length === 0)
      return Array.isArray(text) ? text.map((item) => item) : text;

    if (Array.isArray(text))
      return text.map((item) => formatElements(item, components));

    return formatElements(text, components);
  }, [t, path, values, components, returnObjects]) as string;

  return result;
};

export default T;
`;

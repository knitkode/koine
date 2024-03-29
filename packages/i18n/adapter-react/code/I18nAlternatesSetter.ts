import type { I18nCompiler } from "../../compiler/types";

export default ({}: I18nCompiler.AdapterArg<"react">) => `
"use client";

import { useContext, useEffect } from "react";
import { I18nAlternatesContext } from "./I18nAlternatesContext";
import type { I18n } from "./types";

export type I18nAlternatesProps = {
  alternates: I18n.Alternates;
};

/**
 * NB: Do not use it next.js Pages router
 * 
 * @internal
 */
export const I18nAlternatesSetter = (props: I18nAlternatesProps) => {
  const { alternates } = props;
  const [, setAlternates] = useContext(I18nAlternatesContext);

  useEffect(() => {
    setAlternates(alternates);
  }, [alternates, setAlternates]);

  return null;
};

// export default I18nAlternatesSetter;
`;

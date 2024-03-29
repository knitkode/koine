import type { I18nCompiler } from "../../compiler/types";

export default ({}: I18nCompiler.AdapterArg<"react">) => `
"use client";

import { useEffect } from "react";
import { dom } from "@koine/dom";
import { useLocale } from "./useLocale";

/**
 * @internal
 */
export const I18nEffects = () => {
  const currentLocale = useLocale();

  useEffect(() => {
    if (currentLocale) {
      const html = dom("html");
      if (html) html.lang = currentLocale;
    }
  }, [currentLocale]);

  return null;
};

// export default I18nEffects;
`;

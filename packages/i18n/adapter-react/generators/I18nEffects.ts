import { createGenerator } from "../../compiler/createAdapter";

export default createGenerator("react", (_arg) => {
  return {
    I18nEffects: {
      name: "I18nEffects",
      ext: "tsx",
      index: true,
      content: () => /* j s */ `
"use client";

import React, { useEffect } from "react";
import { dom } from "@koine/dom";
import { useLocale } from "./useLocale";

/**
 * @internal (when used in Next.js)
 */
export const I18nEffects = () => {
  const currentLocale = useLocale();

  useEffect(() => {
    if (currentLocale) {
      const html = dom("html");
      if (html) html.lang = currentLocale;
    }
  }, [currentLocale]);

  return null as React.ReactNode;
};

export default I18nEffects;
`,
    },
  };
});

import { createGenerator } from "../../compiler/createAdapter";

export default createGenerator("react", (_arg) => {
  return {
    I18nEffects: {
      dir: createGenerator.dirs.internal,
      name: "I18nEffects",
      ext: "tsx",
      index: false,
      content: () => /* j s */ `
"use client";

import React, { useEffect } from "react";
import { dom } from "@koine/dom";
import { useLocale } from "../useLocale";

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

  return null as React.ReactNode;
};
`,
    },
  };
});

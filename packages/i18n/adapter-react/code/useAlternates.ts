import type { I18nCompiler } from "../../compiler/types";

export default ({}: I18nCompiler.AdapterArg<"react">) => `
"use client";

import { useContext } from "react";
import { I18nAlternatesContext } from "./I18nAlternatesContext";

export const useAlternates = (
  relative?: boolean,
  includeSearch?: boolean,
  includeHash?: boolean
) => {
  const alternates = useContext(I18nAlternatesContext)[0];

  if (relative) {
    try {
      for (const locale in alternates) {
        const absoluteUrl = alternates[locale];
        if (absoluteUrl) {
          const url = new URL(absoluteUrl);
          alternates[locale] = url.pathname;
          if (includeSearch) alternates[locale] += url.search;
          if (includeHash) alternates[locale] += url.hash;
        }
      }
    } catch(e) {
      // TODO: verify this: we could have empty/invalid alternates URLs here?
    }
  }
  
  return alternates;
}

export default useAlternates;
`;

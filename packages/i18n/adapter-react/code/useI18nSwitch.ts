import type { I18nCompiler } from "../../compiler/types";

export default ({}: I18nCompiler.AdapterArg<"react">) => `
"use client";

import { useContext } from "react";
import { I18nMetadataContext } from "./I18nMetadataContext";

export const useI18nSwitch = (
  absolute?: boolean,
  includeSearch?: boolean,
  includeHash?: boolean
) => {
  const { alternates: urls } = useContext(I18nMetadataContext)[0];

  if (!absolute) {
    try {
      for (const locale in urls) {
        const absoluteUrl = urls[locale];
        if (absoluteUrl) {
          const url = new URL(absoluteUrl);
          urls[locale] = url.pathname;
          if (includeSearch) urls[locale] += url.search;
          if (includeHash) urls[locale] += url.hash;
        }
      }
    } catch(e) {
      // TODO: verify this: we could have empty/invalid languages URLs here?
    }
  }
  
  return urls;
}

export default useI18nSwitch;
`;

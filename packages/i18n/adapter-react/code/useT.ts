import type { I18nCompiler } from "../../compiler/types";

export default ({}: I18nCompiler.AdapterArg<"react">) => `
"use client";

import { useContext, useMemo } from "react";
import { I18nTranslateContext } from "./I18nTranslateContext";
import type { I18n } from "./types";

export const useT = <T extends I18n.TranslateNamespace>(namespace: T) => {
  const t = useContext(I18nTranslateContext).t;
  return useMemo(
    () =>
      (key: string, ...args) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (t as any)(\`\${namespace}:\${key}\`, ...args),
    [t],
  ) as I18n.TranslateNamespaced<T>;
};

export default useT;

`;

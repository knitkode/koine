import type { I18nCompiler } from "../../compiler/types";

export default ({}: I18nCompiler.AdapterArg<"react">) => `
"use client";

import { useContext, useMemo } from "react";
import { I18nContext } from "./I18nContext";
import type { I18n } from "./types";

export const useT = <T extends I18n.TranslateNamespace>(namespace: T) => {
  const t = useContext(I18nContext).t;
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

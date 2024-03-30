import type { I18nCompiler } from "../../compiler/types";

export default ({}: I18nCompiler.AdapterArg<"react">) => `
"use client";

import { useMemo, useState } from "react";
import type { I18n } from "@/i18n";
import { I18nAlternatesContext } from "./I18nAlternatesContext";

type I18nAlternatesProviderProps = React.PropsWithChildren<{
  alternates?: I18n.Alternates;
}>;

/**
 * @internal
 */
export function I18nAlternatesProvider(props: I18nAlternatesProviderProps) {
  const { children } = props;
  const [alternates, setAlternates] = useState<I18n.Alternates>(
    props.alternates || ({} as I18n.Alternates),
  );
  const value = useMemo(
    () => [alternates, setAlternates] as const,
    [alternates],
  );

  return (
    <I18nAlternatesContext.Provider value={value}>
      {children}
    </I18nAlternatesContext.Provider>
  );
}

// export default I18nAlternatesProvider;
`;

import type { I18nCompiler } from "../../compiler/types";

export default ({}: I18nCompiler.AdapterArg<"react">) => `
"use client";

import { useMemo, useState } from "react";
import { I18nMetadataContext } from "./I18nMetadataContext";
import type { I18n } from "./types";

type I18nMetadataProviderProps = React.PropsWithChildren<{
  metadata?: I18n.Metadata;
}>;

/**
 * @internal
 */
export function I18nMetadataProvider(props: I18nMetadataProviderProps) {
  const { children } = props;
  const [metadata, setMetadata] = useState<I18n.Metadata>(
    props.metadata || ({} as I18n.Metadata),
  );
  const value = useMemo(
    () => [metadata, setMetadata] as const,
    [metadata],
  );

  return (
    <I18nMetadataContext.Provider value={value}>
      {children}
    </I18nMetadataContext.Provider>
  );
}

// export default I18nMetadataProvider;
`;

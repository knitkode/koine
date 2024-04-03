import type { I18nCompiler } from "../../compiler/types";

export default ({}: I18nCompiler.AdapterArg<"react">) => `
"use client";

import { useContext, useEffect } from "react";
import { I18nMetadataContext } from "./I18nMetadataContext";
import type { I18n } from "./types";

type I18nMetadataSetterProps = {
  metadata: I18n.Metadata;
};

/**
 * NB: Do not use it next.js Pages router
 * 
 * @internal
 */
export const I18nMetadataSetter = (props: I18nMetadataSetterProps) => {
  const { metadata } = props;
  const [, setMetadata] = useContext(I18nMetadataContext);

  useEffect(() => {
    setMetadata(metadata);
  }, [metadata, setMetadata]);

  return null;
};

// export default I18nMetadataSetter;
`;

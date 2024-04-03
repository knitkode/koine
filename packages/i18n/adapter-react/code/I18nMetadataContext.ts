import type { I18nCompiler } from "../../compiler/types";

export default ({}: I18nCompiler.AdapterArg<"react">) => `
"use client";

import { createContext } from "react";
import { defaultI18nMetadata } from "./defaultI18nMetadata";
import type { I18n } from "./types";

type I18nMetadataContextValue = readonly [
  /** metadata */
  I18n.Metadata,
  /** setMetadata */
  React.Dispatch<React.SetStateAction<I18n.Metadata>>,
];

/**
 * @internal
 */
export const I18nMetadataContext = createContext<I18nMetadataContextValue>([
  defaultI18nMetadata,
  () => (defaultI18nMetadata),
]);

// export default I18nMetadataContext;
`;

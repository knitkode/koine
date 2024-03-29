import type { I18nCompiler } from "../../compiler/types";

export default ({}: I18nCompiler.AdapterArg<"react">) => `
"use client";

import { createContext } from "react";
import type { I18n } from "./types";

type I18nAlternatesContextValue = readonly [
  /** alternates */
  I18n.Alternates,
  /** setAlternates */
  React.Dispatch<React.SetStateAction<I18n.Alternates>>,
];

/**
 * @internal
 */
export const I18nAlternatesContext = createContext<I18nAlternatesContextValue>([
  {} as I18n.Alternates,
  () => ({}),
]);

// export default I18nAlternatesContext;
`;

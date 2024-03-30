import type { I18nCompiler } from "../../compiler/types";

export default ({}: I18nCompiler.AdapterArg<"react">) => `
"use client";

import { createContext } from "react";
import type { I18n } from "./types";

type I18nRouteContextValue = readonly [
  /** routeId */
  I18n.RouteId,
  /** setRouteId */
  React.Dispatch<React.SetStateAction<I18n.RouteId>>,
];

export const I18nRouteContext = createContext<I18nRouteContextValue>([
  "" as I18n.RouteId,
  () => "",
]);

// export default I18nRouteContext;
`;

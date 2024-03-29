import type { I18nCompiler } from "../../compiler/types";

export default ({}: I18nCompiler.AdapterArg<"react">) => `
"use client";

import { I18nRouteContext } from "./I18nRouteContext";
import type { I18n } from "./types";

type I18nRouteProviderProps = React.PropsWithChildren<{
  id: I18n.RouteId;
}>;

export const I18nRouteProvider = (props: I18nRouteProviderProps) => (
  <I18nRouteContext.Provider value={props.id}>
    {props.children}
  </I18nRouteContext.Provider>
);

// export default I18nRouteProvider;
`;

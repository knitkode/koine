import type { I18nCompiler } from "../../compiler/types";

export default ({}: I18nCompiler.AdapterArg<"react">) => `
"use client";

import { useMemo, useState } from "react";
import { I18nRouteContext } from "./I18nRouteContext";
import type { I18n } from "./types";

type I18nRouteProviderProps = React.PropsWithChildren<{
  id: I18n.RouteId;
}>;

/**
 * @internal
 */
export const I18nRouteProvider = (props: I18nRouteProviderProps) => {
  const { children } = props;
  const [id, setId] = useState<I18n.RouteId>(
    props.id || ("" as I18n.RouteId),
  );
  const value = useMemo(
    () => [id, setId] as const,
    [id],
  );

  return (
    <I18nRouteContext.Provider value={value}>
      {children}
    </I18nRouteContext.Provider>
  );
}

// export default I18nRouteProvider;
`;

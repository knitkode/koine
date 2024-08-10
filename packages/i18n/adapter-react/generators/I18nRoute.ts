import { createGenerator } from "../../compiler/createAdapter";

export default createGenerator("react", (_arg) => {
  return {
    I18nRouteContext: {
      name: "I18nRouteContext",
      ext: "tsx",
      index: false,
      content: () => /* j s */ `
"use client";

import React, { createContext } from "react";
import type { I18n } from "./types";

type I18nRouteContextValue = readonly [
  /** routeId */
  I18n.RouteId,
  /** setRouteId */
  React.Dispatch<React.SetStateAction<I18n.RouteId>>,
];

/**
 * @internal
 */
export const I18nRouteContext = createContext<I18nRouteContextValue>([
  "" as I18n.RouteId,
  () => "",
]);
`,
    },
    I18nRouteProvider: {
      name: "I18nRouteProvider",
      ext: "tsx",
      index: true,
      content: () => /* j s */ `
"use client";

import React, { useMemo, useState } from "react";
import { I18nRouteContext } from "./I18nRouteContext";
import type { I18n } from "./types";

type I18nRouteProviderProps = React.PropsWithChildren<{
  id: I18n.RouteId;
}>;

/**
 * @internal (when used in Next.js)
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

export default I18nRouteProvider;
`,
    },
    I18nRouteSetter: {
      name: "I18nRouteSetter",
      ext: "tsx",
      index: true,
      content: () => /* j s */ `
"use client";

import React, { useContext, useEffect } from "react";
import { I18nRouteContext } from "./I18nRouteContext";
import type { I18n } from "./types";

type I18nRouteSetterProps = {
  id: I18n.RouteId;
};

/**
 * @public (when used in Next.js _pages_ router)
 * @internal (when used in Next.js _app_ router)
 */
export const I18nRouteSetter = (props: I18nRouteSetterProps) => {
  const { id } = props;
  const [, setRouteId] = useContext(I18nRouteContext);

  useEffect(() => {
    setRouteId(id);
  }, [id, setRouteId]);

  return null as React.ReactNode;
};

export default I18nRouteSetter;
`,
    },
  };
});

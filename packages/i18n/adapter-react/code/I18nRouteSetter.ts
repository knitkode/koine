import type { I18nCompiler } from "../../compiler/types";

export default ({}: I18nCompiler.AdapterArg<"react">) => `
"use client";

import { useContext, useEffect } from "react";
import { I18nRouteContext } from "./I18nRouteContext";
import type { I18n } from "./types";

type I18nAlternatesProps = {
  id: I18n.Alternates;
};

/**
 * NB: Do not use it next.js Pages router
 * 
 * @internal
 */
export const I18nRouteSetter = (props: I18nAlternatesProps) => {
  const { id } = props;
  const [, setRouteId] = useContext(I18nRouteContext);

  useEffect(() => {
    setRouteId(id);
  }, [id, setRouteId]);

  return null;
};

// export default I18nRouteSetter;
`;

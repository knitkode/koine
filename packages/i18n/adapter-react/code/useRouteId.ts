import type { I18nCompiler } from "../../compiler/types";

export default ({}: I18nCompiler.AdapterArg<"react">) => `
"use client";

import { useContext } from "react";
import { I18nRouteContext } from "./I18nRouteContext";

export const useRouteId = () => useContext(I18nRouteContext)[0];
  
export default useRouteId;
`;

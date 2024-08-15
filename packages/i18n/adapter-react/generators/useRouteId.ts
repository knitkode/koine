import { createGenerator } from "../../compiler/createAdapter";

export default createGenerator("react", (_arg) => {
  return {
    useRouteId: {
      name: "useRouteId",
      ext: "ts",
      index: true,
      content: () => /* j s */ `
"use client";

import { useContext } from "react";
import { I18nRouteContext } from "./internal/I18nRouteContext";

export const useRouteId = () => useContext(I18nRouteContext)[0];
  
export default useRouteId;
`,
    },
  };
});

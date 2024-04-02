import type { I18nCompiler } from "../../compiler/types";

export default ({
  options: {
    routes: { localeParamName },
  },
  adapterOptions: { router },
}: I18nCompiler.AdapterArg<"next">) => {
  const maybeReplace = localeParamName
    ? `.replace("[${localeParamName}]/", "")`
    : "";
  switch (router) {
    case "app":
      return `
"use client";

import { useContext } from "react";
import { I18nRouteContext } from "./I18nRouteContext";

export const useRouteId = () => useContext(I18nRouteContext)[0];
  
export default useRouteId;
`;
    case "pages":
      return `
import { useRouter } from "next/router";
import { pathnameToRouteId } from "./pathnameToRouteId";
import type { I18n } from "./types";

export const useRouteId = () => 
  pathnameToRouteId(useRouter().pathname${maybeReplace}) as I18n.RouteId;

export default useRouteId;
`;
    case "migrating":
    default:
      return `
"use client";

import { useContext } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { I18nRouteContext } from "./I18nRouteContext";
import { pathnameToRouteId } from "./pathnameToRouteId";
import type { I18n } from "./types";

export const useRouteId = () => {
  const fromCtx = useContext(I18nRouteContext)[0];
  let fromPages = "";
  let fromApp = "";

  try {
    fromPages = pathnameToRouteId(
      useRouter().pathname${maybeReplace},
    ) as I18n.RouteId;
  } catch (e) {
    fromApp = pathnameToRouteId(
      (usePathname() || "")${maybeReplace},
    ) as I18n.RouteId;
  }

  return fromCtx || fromPages || fromApp;
};

export default useRouteId;
`;
  }
};

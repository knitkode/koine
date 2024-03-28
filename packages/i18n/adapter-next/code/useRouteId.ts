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
import { usePathname } from "next/navigation";
import { pathnameToRouteId } from "./pathnameToRouteId";
import type { I18n } from "./types";

export const useRouteId = () => 
  pathnameToRouteId((usePathname() || "")${maybeReplace}) as I18n.RouteId;

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
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { pathnameToRouteId } from "./pathnameToRouteId";
import type { I18n } from "./types";

export const useRouteId = () => {
  try {
    return pathnameToRouteId(
      useRouter().pathname${maybeReplace},
    ) as I18n.RouteId;
  } catch (e) {
    return pathnameToRouteId(
      (usePathname() || "")${maybeReplace},
    ) as I18n.RouteId;
  }
};

export default useRouteId;
`;
  }
};

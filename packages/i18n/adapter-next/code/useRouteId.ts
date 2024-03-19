import type { I18nCompiler } from "../../compiler/types";

export default ({
  options: {
    routes: { localeParamName },
  },
}: I18nCompiler.AdapterArg<"next">) => `
import { useRouter } from "next/router";
import type { I18n } from "./types";
import { pathnameToRouteId } from "./pathnameToRouteId";

export const useRouteId = () => 
  pathnameToRouteId(useRouter().pathname${localeParamName ? `.replace("[${localeParamName}]/", "")` : ""}) as I18n.RouteId;

export default useRouteId;
`;

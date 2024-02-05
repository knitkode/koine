// import type { I18nGenerate } from "../../types";

export default (/* data: I18nGenerate.Data, */) => `
import { useRouter } from "next/router";
import type { I18n } from "./types";
import { pathnameToRouteId } from "./pathnameToRouteId";

export const useRouteId = () => 
  pathnameToRouteId(useRouter().pathname) as I18n.RouteId;

export default useRouteId;
`;

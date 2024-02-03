import { useRouter } from "next/router";
import { pathnameToRouteId } from "./pathnameToRouteId";
import type { I18n } from "./types";

export const useRouteId = () =>
  pathnameToRouteId(useRouter().pathname) as I18n.RouteId;

export default useRouteId;

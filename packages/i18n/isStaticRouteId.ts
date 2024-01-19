import { routeHasDynamicPortion } from "./routeHasDynamicPortion";
import type { ToRoute, ToRouteStatic } from "./types";

export function isStaticRouteId(routeId: ToRoute): routeId is ToRouteStatic {
  return !routeHasDynamicPortion(routeId);
}

export default isStaticRouteId;

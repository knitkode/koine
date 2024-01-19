import { routeHasDynamicPortion } from "./routeHasDynamicPortion";
import type { ToRoute, ToRouteDynamic } from "./types";

export function isDynamicRouteId(routeId: ToRoute): routeId is ToRouteDynamic {
  return routeHasDynamicPortion(routeId);
}

export default isDynamicRouteId;

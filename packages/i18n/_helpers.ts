import type { ToRoute, ToRouteDynamic, ToRouteStatic } from "./types";

export function routeHasDynamicPortion(routeIdOrPortion: string) {
  return /\[/.test(routeIdOrPortion);
}

export function isStaticRouteId(routeId: ToRoute): routeId is ToRouteStatic {
  return !routeHasDynamicPortion(routeId);
}

export function isDynamicRouteId(routeId: ToRoute): routeId is ToRouteDynamic {
  return routeHasDynamicPortion(routeId);
}

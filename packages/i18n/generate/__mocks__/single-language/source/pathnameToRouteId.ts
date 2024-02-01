/**
 * Convert a URL like pathname to a "named route"
 * E.g. it transforms:
 * - `/dashboard/user/[id]` into `dashboard.user.[id]`
 */
export const pathnameToRouteId = (pathname: string) =>
  pathname
    .replace(/^\//g, "")
    .replace(/\//g, ".")
    .replace(/\/index$/, "");

export default pathnameToRouteId;

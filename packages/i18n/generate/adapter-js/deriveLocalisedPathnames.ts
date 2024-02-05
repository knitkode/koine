// import type { I18nGenerate } from "../../types";

export default (/* data: I18nGenerate.Data, */) => `
import { locales } from "./locales";
import { to } from "./to";
import type { I18n } from "./types";

function getPathnameDynamicPortionName(pathname: string) {
  const res = pathname.match(/\\[(.+)\\]/);
  return res ? res[1] : false;
}

function isStaticPathname(pathname: string) {
  return !/\\[/.test(pathname);
}

// e.g. ['my', 'path', 'id', 'view'] or ['nl' 'my', 'path', 'id', 'view']
// where the first might be the locale (depending on hideDefaultLocaleInUrl)
function getPathnameParts(pathname: string) {
  return pathname
    .split("/")
    .slice(1)
    .filter((p, i) => (i === 0 ? !locales.includes(p as I18n.Locale) : true));
}

function localisePathname(
  locale: I18n.Locale,
  // e.g. "my.path.[id].view"
  routeId: I18n.RouteIdDynamic | I18n.RouteIdStatic,
  locationLike: LocationLike
) {
  const toPathname = to(routeId as I18n.RouteIdStatic, locale);

  if (isStaticPathname(toPathname)) {
    return toPathname;
  }
  // e.g. ['my', 'path', '[id]', 'view']
  const toPathnameParts = getPathnameParts(toPathname);
  // e.g. "my.path.[id].view"
  const routeIdDynamic = routeId as I18n.RouteIdDynamic;
  // e.g. /my/path/1 23/view
  const currentPathname = locationLike.pathname;
  // e.g. ['my', 'path', '123', 'view']
  const currentPathnameParts = getPathnameParts(currentPathname);
  // e.g. { id: "123" }
  const params: Record<string, string> = {};

  for (let i = 0; i < toPathnameParts.length; i++) {
    // e.g. "my" or "[id]"
    const part = toPathnameParts[i];
    // e.g. "id"
    const name = getPathnameDynamicPortionName(part);
    if (name) {
      // e.g. "123"
      const value = currentPathnameParts[i];
      params[name] = value;
    }
  }

  return (
    to(routeIdDynamic, params as never, locale) +
    location?.search || "" +
    location?.hash || ""
  );
}

type LocationLike = { pathname: string; search?: string; hash?: string; };

export type LocalisedPathnames = Record<I18n.Locale, string>;

export const deriveLocalisedPathnames = (routeId: I18n.RouteId, locationLike: LocationLike) =>
  locales.reduce((pathnames, locale) => {
    pathnames[locale] = localisePathname(locale, routeId, locationLike);
    return pathnames;
  }, {} as LocalisedPathnames);

export default deriveLocalisedPathnames;
`;

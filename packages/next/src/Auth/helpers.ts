import { isString } from "@koine/utils";
import type { Translate } from "../I18n";

/**
 * @see next/auth `pages` mapping: https://next-auth.js.org/configuration/pages`
 */
export type AuthRoutesMap = {
  login?: string;
  profile?: string;
  register?: string;
  /** Array of regexes to match pathnames of protected routes */
  secured?: RegExp[];
};

export const AUTH_ROUTES: AuthRoutesMap = {
  login: process.env["AUTH_ROUTE_LOGIN"],
  profile: process.env["AUTH_ROUTE_PROFILE"],
  register: process.env["AUTH_ROUTE_REGISTER"],
  secured: JSON.parse(process.env["AUTH_ROUTES_SECURED"] || "[]"),
};

export function getAuthRoutes(t: Translate) {
  return (Object.keys(AUTH_ROUTES) as Array<keyof AuthRoutesMap>).reduce(
    (map, name) => {
      const routePage = AUTH_ROUTES[name];

      // @ts-expect-error cannot remember
      map[name] = isString(routePage) ? t(`~:${AUTH_ROUTES[name]}`) : routePage;
      return map;
    },
    {} as AuthRoutesMap
  );
}

/**
 * @param url e.g. "http://localhost:3000/signin?callbackUrl=http://localhost:3000/profile"
 */
export function getCallbackUrl(url: string = window.location.href) {
  return url.split("callbackUrl=")[1] || "";
}

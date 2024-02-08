// import type { I18nCompiler } from "../../types";

export default (/* {}: I18nCompiler.AdapterArg, */) => `
"use client";

import { to } from "./to";
import type { I18n } from "./types";
import { useLocale } from "./useLocale";

export type UseToReturn = ReturnType<typeof useTo>;

export const useTo = () => {
  const locale = useLocale();
  return <TRoute extends I18n.RouteId>(
    ...args: TRoute extends I18n.RouteIdDynamic
      ? [routeId: TRoute, params: I18n.RouteParams[TRoute]]
      : TRoute extends I18n.RouteIdStatic
        ? [routeId: I18n.RouteIdStatic]
        : never
  ) => {
    const [routeId, params] = args;
    return params
      ? to(routeId, params, locale)
      : to(routeId as I18n.RouteIdStatic, locale);
  };
};

export default useTo;
`;

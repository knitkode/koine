// import type { I18nCompiler } from "../../compiler/types";

export default (/* {}: I18nCompiler.AdapterArg */) => `
"use client";

import { to } from "./to";
import type { I18n } from "./types";
import { useLocale } from "./useLocale";

export type UseToReturn = ReturnType<typeof useTo>;

export const useTo = () => {
  const locale = useLocale();
  return <Id extends I18n.RouteId>(
    ...args: Id extends I18n.RouteIdDynamic
      ? [routeId: Id, params: I18n.RouteParams[Id]]
      : Id extends I18n.RouteIdStatic
        ? [routeId: Id]
        : never
  ) => {
    const [routeId, params] = args;
    return (
      // @ts-expect-error nevermind for now
      params ? to(routeId, params, locale) : to(routeId, locale)
    ) as I18n.RoutePathnames[Id];
  };
};

export default useTo;
`;

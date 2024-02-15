import type { I18nCompiler } from "../../compiler/types";

export default ({ config }: I18nCompiler.AdapterArg) => `
"use client";

import { routesSlim } from "./routesSlim";
import { to } from "./to";
import type { I18n } from "./types";
import { useLocale } from "./useLocale";

type RoutesSlim = typeof routesSlim;

export type UseToReturn = ReturnType<typeof useTo>;

export const useTo = () => {
  const locale = useLocale();
  return <TRoute extends I18n.RouteId>(
    ...args: TRoute extends I18n.RouteIdDynamic
      ? [routeId: TRoute, params: I18n.RouteParams[TRoute]]
      : TRoute extends I18n.RouteIdStatic
        ? [routeId: TRoute]
        : never
  ) => {
    const [routeId, params] = args;
    return (
      params ? to(routeId, params, locale) : to(routeId, locale)
    ) as RoutesSlim[TRoute] extends string
      ? RoutesSlim[TRoute]
      : "${config.defaultLocale}" extends keyof RoutesSlim[TRoute]
        ? RoutesSlim[TRoute]["${config.defaultLocale}"]
        : never;
  };
};

export default useTo;
`;

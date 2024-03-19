import type { I18nCompiler } from "../../compiler/types";

export default ({}: I18nCompiler.AdapterArg<"next">) => `
"use client";

import { to } from "./to";
import type { I18n } from "./types";
import { useLocale } from "./useLocale";

export type UseToReturn = ReturnType<typeof useTo>;

export const useTo = () => {
  const locale = useLocale();
  return <Id extends I18n.RouteId>(
    routeId: Id,
    ...args: Id extends I18n.RouteIdDynamic
      ? [params: I18n.RouteParams[Id]]
      : []
  ) =>
    args[0]
      ? // @ts-expect-error nevermind
        (to(routeId, args[0], locale) as I18n.RoutePathnames[Id])
      : // @ts-expect-error nevermind
        (to(routeId, locale) as I18n.RoutePathnames[Id]);
};

export default useTo;
`;

import { createGenerator } from "../../compiler/createAdapter";

export default createGenerator("next", (arg) => {
  const {
    routes: { dynamicRoutes },
  } = arg;
  return {
    useTo: {
      name: "useTo",
      ext: "ts",
      index: true,
      // prettier-ignore
      content: () => /* j s */`
"use client";

import { to } from "./to";
import type { I18n } from "./types";
import { useLocale } from "./useLocale";

export type UseToReturn = ReturnType<typeof useTo>;

export const useTo = () => {
  const locale = useLocale();${dynamicRoutes.length ? `

  return <Id extends I18n.RouteId>(
    routeId: Id,
    ...args: Id extends I18n.RouteIdDynamic
      ? [params: I18n.RouteParams[Id]]
      : []
  ) =>
    args[0]
      ? // @ts-ignore dynamic to fn typing
        (to(routeId, args[0], locale) as I18n.RoutePathnames[Id])
      : // @ts-expect-error dynamic to fn typing
        (to(routeId, locale) as I18n.RoutePathnames[Id]);
  ` : `

  return <Id extends I18n.RouteId>(routeId: Id) =>
    to(routeId, locale) as I18n.RoutePathnames[Id];
  `}
};

export default useTo;
`,
    },
  };
});

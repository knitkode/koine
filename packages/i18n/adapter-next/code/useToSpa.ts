// import type { I18nCompiler } from "../../compiler/types";

export default (/* {}: I18nCompiler.AdapterArg */) => `
"use client";

import { toSpa } from "./toSpa";
import type { I18n } from "./types";
import { useLocale } from "./useLocale";

export type UseToSpaReturn = ReturnType<typeof useToSpa>;

export const useToSpa = () => {
  const locale = useLocale();
  return <
    Root extends keyof I18n.RouteSpa,
    Path extends Extract<keyof I18n.RouteSpa[Root], string>
  >(
    ...args: I18n.RouteJoinedId<Root, Path> extends I18n.RouteIdDynamic
    ? [root: Root, path: Path, params: I18n.RouteParams[I18n.RouteJoinedId<Root, Path>]]
    : I18n.RouteJoinedId<Root, Path> extends I18n.RouteIdStatic
      ? [root: Root, path: Path]
      : never
  ) => {
    const [root, path, params] = args;
    return (
      // @ts-expect-error FIXME: types
      params ? toSpa(root, path, params, locale) : toSpa(root, path, locale)
    ) as I18n.RouteSpa[Root][Path];
  };
};

export default useToSpa;
`;

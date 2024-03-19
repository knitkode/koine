import type { I18nCompiler } from "../../compiler/types";

export default ({}: I18nCompiler.AdapterArg<"next">) => `
"use client";

import { toSpa } from "./toSpa";
import type { I18n } from "./types";
import { useLocale } from "./useLocale";

export type UseToSpaReturn = ReturnType<typeof useToSpa>;

export const useToSpa = () => {
  const locale = useLocale();
  return <
    Root extends keyof I18n.RouteSpa,
    Path extends Extract<keyof I18n.RouteSpa[Root], string>,
  >(
    root: Root,
    path: Path,
    ...args: I18n.RouteJoinedId<Root, Path> extends I18n.RouteIdDynamic
      ? [params: I18n.RouteParams[I18n.RouteJoinedId<Root, Path>]]
      : I18n.RouteJoinedId<Root, Path> extends I18n.RouteIdStatic
        ? []
        : never
  ) => {
    const [params] = args;
    return (
      // prettier-ignore
      // @ts-ignore FIXME: types
      (params ? toSpa(root, path, params, locale) : toSpa(root, path, locale)) as I18n.RouteSpa[Root][Path]
    );
  };
};

export default useToSpa;
`;

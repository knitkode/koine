// import type { I18nCodegen } from "../../types";

export default (/* {}: I18nCodegen.AdapterArg, */) => `
"use client";

import type { TransProps } from "next-translate";
import Trans from "next-translate/Trans";
import type { I18n } from "./types";

export type TProps<
  TNamespace extends I18n.TranslateNamespace | undefined = undefined,
> =
  | (Omit<TransProps, "i18nKey" | "ns"> & {
      i18nKey: I18n.TranslationsAllPaths;
    })
  | (Omit<TransProps, "i18nKey" | "ns"> & {
      ns: TNamespace;
      i18nKey: I18n.TranslationsPaths<TNamespace>;
    });

const TypedT = <
  TNamespace extends I18n.TranslateNamespace | undefined = undefined,
>(
  props: TProps<TNamespace>,
) =>
  (<Trans {...(props as TransProps)} />) as React.ReactElement<
    TProps<TNamespace>
  >;

export const T = Trans as typeof TypedT;

export default T;
`;

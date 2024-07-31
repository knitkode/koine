import { createGenerator } from "../../compiler/createAdapter";

export default createGenerator("next-translate", (_arg) => {
  return {
    Trans: {
      name: "Trans",
      ext: "tsx",
      index: true,
      content: () => /* js */ `
"use client";

import type { TransProps as NextTranslateTransProps } from "next-translate";
import NextTranslateTrans from "next-translate/Trans";
import type { I18n } from "./types";

export type TransProps<
  TNamespace extends I18n.TranslateNamespace | undefined = undefined,
> =
  | (Omit<NextTranslateTransProps, "i18nKey" | "ns"> & {
      i18nKey: I18n.TranslationsAllPaths;
    })
  | (Omit<NextTranslateTransProps, "i18nKey" | "ns"> & {
      ns: TNamespace;
      i18nKey: I18n.TranslationsPaths<TNamespace>;
    });

const TypedTrans = <
  TNamespace extends I18n.TranslateNamespace | undefined = undefined,
>(
  props: TransProps<TNamespace>,
) =>
  (<NextTranslateTrans {...(props as NextTranslateTransProps)} />) as React.ReactElement<
    TransProps<TNamespace>
  >;

export const Trans = NextTranslateTrans as typeof TypedTrans;

export default Trans;
`,
    },
  };
});

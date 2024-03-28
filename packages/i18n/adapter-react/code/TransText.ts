import type { I18nCompiler } from "../../compiler/types";

export default ({}: I18nCompiler.AdapterArg<"react">) => `
"use client";

import { useMemo } from "react";
import { formatElements } from "./formatElements";
import type { TProps } from "./T";
import type { I18n } from "./types";

export type TransTextProps<
  TNamespace extends I18n.TranslateNamespace | undefined,
> = Pick<TProps<TNamespace>, "components"> & {
  text: string;
};

export const TransText = <
  TNamespace extends I18n.TranslateNamespace | undefined,
>({
  text,
  components,
}: TransTextProps<TNamespace>) => {
  return useMemo(
    () =>
      !components || components.length === 0
        ? text
        : formatElements(text, components),
    [text, components],
  ) as string;
};

export default TransText;
`;

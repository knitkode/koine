import type { I18nCompiler } from "../../compiler/types";

export default ({}: I18nCompiler.AdapterArg<"react">) => `
"use client";

import { useMemo } from "react";
import type { TProps } from "./T";
import { formatElements } from "./formatElements";

export type TransTextProps = Pick<TProps, "components"> & {
  text: string;
};

export const TransText = ({ text, components }: TransTextProps) => {
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

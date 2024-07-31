import { createGenerator } from "../../compiler/createAdapter";

export default createGenerator("react", (_arg) => {
  return {
    TransText: {
      name: "TransText",
      ext: "tsx" as const,
      index: true,
      content: () => /* js */ `
"use client";

import React, { useMemo } from "react";
import type { TransProps } from "./Trans";
import { formatElements } from "./formatElements";

export type TransTextProps = Pick<TransProps, "components"> & {
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
`,
    },
  };
});

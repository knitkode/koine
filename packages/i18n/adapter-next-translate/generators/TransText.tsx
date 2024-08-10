import { createGenerator } from "../../compiler/createAdapter";

export default createGenerator("next-translate", (_arg) => {
  return {
    TransText: {
      name: "TransText",
      ext: "tsx",
      index: true,
      content: () => /* j s */ `
"use client";

import _TransText from "next-translate/TransText";

export const TransText = _TransText;

export default TransText;
`,
    },
  };
});

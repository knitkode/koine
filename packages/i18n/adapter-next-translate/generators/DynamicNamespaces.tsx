import { createGenerator } from "../../compiler/createAdapter";

export default createGenerator("next-translate", (_arg) => {
  return {
    DynamicNamespaces: {
      name: "DynamicNamespaces",
      ext: "tsx",
      index: true,
      content: () => /* j s */ `
"use client";

import _DynamicNamespaces from "next-translate/DynamicNamespaces";

export const DynamicNamespaces = _DynamicNamespaces;

export default DynamicNamespaces;
`,
    },
  };
});

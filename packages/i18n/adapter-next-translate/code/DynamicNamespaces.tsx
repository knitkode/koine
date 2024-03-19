import type { I18nCompiler } from "../../compiler/types";

export default ({}: I18nCompiler.AdapterArg<"next-translate">) => `
"use client";

import _DynamicNamespaces from "next-translate/DynamicNamespaces";

export const DynamicNamespaces = _DynamicNamespaces;

export default DynamicNamespaces;
`;

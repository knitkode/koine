// import type { I18nCompiler } from "../../types";

export default (/* {}: I18nCompiler.AdapterArg, */) => `
"use client";

import _DynamicNamespaces from "next-translate/DynamicNamespaces";

export const DynamicNamespaces = _DynamicNamespaces;

export default DynamicNamespaces;
`;

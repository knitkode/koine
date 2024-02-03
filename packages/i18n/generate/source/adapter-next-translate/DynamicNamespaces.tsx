// import type { I18nGenerate } from "../../types";

export default (/* data: I18nGenerate.Data, */) => `
"use client";

import _DynamicNamespaces from "next-translate/DynamicNamespaces";

export const DynamicNamespaces = _DynamicNamespaces;
`;

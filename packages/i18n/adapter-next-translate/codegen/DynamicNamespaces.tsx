// import type { I18nCodegen } from "../../types";

export default (/* {}: I18nCodegen.AdapterArg, */) => `
"use client";

import _DynamicNamespaces from "next-translate/DynamicNamespaces";

export const DynamicNamespaces = _DynamicNamespaces;

export default DynamicNamespaces;
`;

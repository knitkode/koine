// import type { I18nCompiler } from "../../types";

export default (/* {}: I18nCompiler.AdapterArg, */) => `
"use client";

import _TransText from "next-translate/TransText";

export const TransText = _TransText;

export default TransText;
`;

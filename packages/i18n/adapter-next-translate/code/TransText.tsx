import type { I18nCompiler } from "../../compiler/types";

export default ({}: I18nCompiler.AdapterArg<"next-translate">) => `
"use client";

import _TransText from "next-translate/TransText";

export const TransText = _TransText;

export default TransText;
`;

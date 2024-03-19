import type { I18nCompiler } from "../../compiler/types";

export default ({}: I18nCompiler.AdapterArg<"next-translate">) => `
"use client";

import _I18nProvider from "next-translate/I18nProvider";

export const I18nProvider = _I18nProvider;

export default I18nProvider;
`;

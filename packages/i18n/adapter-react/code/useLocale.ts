import type { I18nCompiler } from "../../compiler/types";

export default ({}: I18nCompiler.AdapterArg<"react">) => `
"use client";

import { useContext } from "react";
import { defaultLocale } from "./defaultLocale";
import { I18nTranslateContext } from "./I18nTranslateContext";

export const useLocale = () => useContext(I18nTranslateContext).locale || defaultLocale;

export default useLocale;
`;

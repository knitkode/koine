import type { I18nCompiler } from "../../compiler/types";

export default ({}: I18nCompiler.AdapterArg<"react">) => `
"use client";

import { useContext } from "react";
import { defaultLocale } from "./defaultLocale";
import { I18nContext } from "./I18nContext";

export const useLocale = () => useContext(I18nContext).locale || defaultLocale;

export default useLocale;
`;

import type { I18nCompiler } from "../../compiler/types";

export default ({ config }: I18nCompiler.AdapterArg<"react">) => `
"use client";

import { useContext } from "react";
import { I18nContext } from "./I18nContext";
import type { I18n } from "./types";

export const useLocale = () => useContext(I18nContext).locale || "${config.defaultLocale}";

export default useLocale;
`;

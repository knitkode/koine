import type { I18nCompiler } from "../../compiler/types";

export default ({}: I18nCompiler.AdapterArg<"react">) => `
import React from "react";
import { I18nLocaleContext } from "./I18nLocaleContext";

/**
 * **For React RSC only**
 * 
 * It grabs the current locale from NodeJS' \`AsyncLocalStorage\` implementation
 * used in \`I18nLocaleContext\`.
 */
export const getLocale = () => {
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-extra-boolean-cast
    if (Boolean(React.useState)) {
      throw new Error("getLocale only works in Server Components");
    }
  }
  return I18nLocaleContext.get();
};

export default getLocale;
`;

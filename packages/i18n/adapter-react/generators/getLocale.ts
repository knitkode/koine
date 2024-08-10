import { createGenerator } from "../../compiler/createAdapter";

export default createGenerator("react", (_arg) => {
  return {
    getLocale: {
      dir: "server",
      name: "getLocale",
      ext: "ts",
      index: true,
      content: () => /* j s */ `
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
    if (Boolean(React.useState)) {
      throw new Error("getLocale only works in Server Components");
    }
  }
  return I18nLocaleContext.get();
};

export default getLocale;
`,
    },
  };
});

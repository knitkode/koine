import { createGenerator } from "../../compiler/createAdapter";
import { GLOBAL_I18N_IDENTIFIER } from "../../compiler/helpers";


export default createGenerator("js", (arg) => {
  const { config } = arg;

  return {
    getLocaleInBrowser: {
      name: "getLocaleInBrowser",
      ext: "ts",
      index: true,
      content: () => /* j s */ `
import { defaultLocale } from "./defaultLocale";

/**
 * Get current locale in browser context
 */
export const getLocaleInBrowser = () =>
  typeof window !== "undefined" ? window.${GLOBAL_I18N_IDENTIFIER} : "${config.defaultLocale}";

export default getLocaleInBrowser;
      `,
    },
  };
});

import { createGenerator } from "../../compiler/createAdapter";

export default createGenerator("js", (arg) => {
  const { config } = arg;
  const locales = `[${config.locales.map((l) => `"${l}"`).join(", ")}]`;

  return {
    locales: {
      name: "locales",
      ext: "ts",
      index: true,
      content: () => /* js */ `
export const locales = ${locales} as const;

export default locales;
`,
    },
    defaultLocale: {
      name: "defaultLocale",
      ext: "ts",
      index: true,
      content: () => /* js */ `
import type { I18n } from "./types";

export const defaultLocale: I18n.Locale = "${config.defaultLocale}";

export default defaultLocale;
`,
    },
    config: {
      name: "config",
      ext: "ts",
      index: true,
      content: () => /* js */ `
import { locales } from "./locales";
import { defaultLocale } from "./defaultLocale";

/**
 */
export const config = {
  locales,
  defaultLocale,
  hideDefaultLocaleInUrl: ${config.hideDefaultLocaleInUrl},
}

export default config;
`,
    },
    configCjs: {
      name: "config.cjs",
      ext: "js",
      content: () => /* js */ `
const { locales } = require("./locales");
const { defaultLocale } = require("./defaultLocale");

const config = {
  locales,
  defaultLocale,
  hideDefaultLocaleInUrl: ${config.hideDefaultLocaleInUrl},
};

exports.config = config;

module.exports = config;
`,
    },
  };
});

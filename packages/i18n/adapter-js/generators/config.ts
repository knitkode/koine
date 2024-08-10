import { createGenerator } from "../../compiler/createAdapter";

export default createGenerator("js", (arg) => {
  const { config } = arg;
  const locales = `[${config.locales.map((l) => `"${l}"`).join(", ")}]`;

  return {
    locales: {
      name: "locales",
      ext: "ts",
      index: true,
      content: () => /* j s */ `
export const locales = ${locales} as const;

export default locales;
`,
    },
    defaultLocale: {
      name: "defaultLocale",
      ext: "ts",
      index: true,
      content: () => /* j s */ `
import type { I18n } from "./types";

export const defaultLocale: I18n.Locale = "${config.defaultLocale}";

export default defaultLocale;
`,
    },
    config: {
      name: "config",
      ext: "ts",
      index: true,
      content: () => /* j s */ `
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
      index: false,
      content: () => /* j s */ `
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

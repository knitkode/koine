import { swcCreateTransforms } from "@koine/node/swc";
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
      // TODO: decide whether enabling this generator
      disabled: true,
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
      // TODO: decide whether enabling this generator
      disabled: true,
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
    swcTransforms: {
      name: "i18nSwcTransforms",
      ext: "js",
      index: false,
      disabled: arg.options.adapter.options.modularize ? false : true,
      content: () => {
        const { tsconfig } = arg.options.write || {};
        if (!tsconfig) return "";

        // prettier-ignore
        const flat = swcCreateTransforms([
          { path: "@koine/i18n", flat: true },
          { path: tsconfig.alias, flat: true },
          { path: tsconfig.alias + "/" + arg.options.routes.functions.dir, flat: true },
          { path: tsconfig.alias + "/" + arg.options.translations.functions.dir, flat: true },
          { path: tsconfig.alias + "/" + createGenerator.dirs.server, flat: true },
        ])
        const deep = swcCreateTransforms([
          { path: "@koine/i18n" as const, flat: true },
          { path: tsconfig.alias },
        ]);
        return `
  export const i18nSwcTransforms = {
    flat: ${JSON.stringify(flat, null, 2)},
    deep: ${JSON.stringify(deep, null, 2)}
  }
`;
      },
    },
  };
});

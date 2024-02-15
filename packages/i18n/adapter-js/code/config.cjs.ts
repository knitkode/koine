import type { I18nCompiler } from "../../compiler/types";

export default ({ config }: I18nCompiler.AdapterArg) => `
const { locales } = require("./locales");
const { defaultLocale } = require("./defaultLocale");

const config = {
  locales,
  defaultLocale,
  hideDefaultLocaleInUrl: ${config.hideDefaultLocaleInUrl},
};

exports.config = config;

module.exports = config;
`;

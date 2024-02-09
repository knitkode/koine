import type { I18nCompiler } from "../../compiler";
import { generateRewrites } from "../rewrites";

export default ({ config, routes }: I18nCompiler.AdapterArg) => {
  const value = JSON.stringify(generateRewrites(config, routes), null, 2);
  return `module.exports = ${value}`;
};

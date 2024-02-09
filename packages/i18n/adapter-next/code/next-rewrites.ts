import type { I18nCompiler } from "../../compiler";
import { getRewrites } from "../rewrites";

export default ({ config, routes }: I18nCompiler.AdapterArg) => {
  const value = JSON.stringify(getRewrites(config, routes), null, 2);
  return `module.exports = ${value}`;
};

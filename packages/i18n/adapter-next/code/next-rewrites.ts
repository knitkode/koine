import type { I18nCompiler } from "../../compiler/types";
import { generateRewrites } from "../rewrites";

export default ({ config, routes, options }: I18nCompiler.AdapterArg) => {
  const value = JSON.stringify(
    generateRewrites(config, routes.byId, options.routes),
    null,
    2,
  );
  return `module.exports = ${value}`;
};

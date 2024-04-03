import type { I18nCompiler } from "../../compiler/types";
import { generateRewrites } from "../rewrites";

export default ({
  config,
  routes,
  options,
}: I18nCompiler.AdapterArg<"next">) => {
  const value = JSON.stringify(
    generateRewrites(config, options.routes, routes.byId),
    null,
    2,
  );
  return `module.exports = ${value}`;
};

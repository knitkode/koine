import type { I18nCompiler } from "../../compiler/types";
import { generateRedirects } from "../redirects";

export default ({
  config,
  routes,
  options,
}: I18nCompiler.AdapterArg<"next">) => {
  const value = JSON.stringify(
    generateRedirects(config, routes.byId, options.routes),
    null,
    2,
  );
  return `module.exports = ${value}`;
};

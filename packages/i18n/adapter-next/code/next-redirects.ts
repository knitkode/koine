import type { I18nCompiler } from "../../compiler/types";
import { generateRedirects } from "../redirects";

export default ({
  config,
  options,
  routes,
}: I18nCompiler.AdapterArg<"next">) => {
  const value = JSON.stringify(
    generateRedirects(config, options.routes, routes.byId),
    null,
    2,
  );
  return `module.exports = ${value}`;
};

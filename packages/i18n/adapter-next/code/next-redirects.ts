import type { I18nCompiler } from "../../compiler";
import { generateRedirects } from "../redirects";

export default ({ config, routes }: I18nCompiler.AdapterArg) => {
  const value = JSON.stringify(generateRedirects(config, routes), null, 2);
  return `module.exports = ${value}`;
};

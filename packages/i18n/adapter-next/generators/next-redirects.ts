import { createGenerator } from "../../compiler/createAdapter";
import { generateRedirects } from "../plugin/redirects";

export default createGenerator("next", (arg) => {
  const { config, options, routes } = arg;
  const value = JSON.stringify(
    generateRedirects(config, options.routes, routes.byId),
    null,
    2,
  );
  return {
    nextRedirects: {
      dir: createGenerator.dirs.internal,
      name: "next-redirects",
      ext: "js",
      index: false,
      disabled: arg.config.debug === "internal",
      content: () => /* j s */ `
/**
 * @type {import("next/dist/lib/load-custom-routes").Redirect[]}
 */
module.exports = ${value}
`,
    },
  };
});

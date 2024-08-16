import { createGenerator } from "../../compiler/createAdapter";
import { generateRewrites } from "../plugin/rewrites";

export default createGenerator("next", (arg) => {
  const { config, routes, options } = arg;
  const value = JSON.stringify(
    generateRewrites(config, options.routes, routes.byId),
    null,
    2,
  );
  return {
    nextRewrites: {
      dir: createGenerator.dirs.internal,
      name: "next-rewrites",
      ext: "js",
      index: false,
      disabled: arg.config.debug === "internal",
      content: () => /* j s */ `
/**
 * @type {import("next/dist/lib/load-custom-routes").Rewrite[]}
 */
module.exports = ${value}
`,
    },
  };
});

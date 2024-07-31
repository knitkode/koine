import { createGenerator } from "../../compiler/createAdapter";
import { generateRewrites } from "../rewrites";

export default createGenerator("next", (arg) => {
  const { config, routes, options } = arg;
  const value = JSON.stringify(
    generateRewrites(config, options.routes, routes.byId),
    null,
    2,
  );
  return {
    nextRewrites: {
      name: "next-rewrites",
      ext: "js",
      content: () => /* js */ `
/**
 * @type {import("next/dist/lib/load-custom-routes").Rewrite[]}
 */
module.exports = ${value}
`,
    },
  };
});

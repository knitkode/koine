import { createGenerator } from "../../compiler/createAdapter";
import { generateRedirects } from "../redirects";

export default createGenerator("next", (arg) => {
  const { config, options, routes } = arg;
  const value = JSON.stringify(
    generateRedirects(config, options.routes, routes.byId),
    null,
    2,
  );
  return {
    nextRedirects: {
      name: "next-redirects",
      ext: "js",
      content: () => /* js */ `
/**
 * @type {import("next/dist/lib/load-custom-routes").Redirect[]}
 */
module.exports = ${value}
`,
    },
  };
});

import { escapeRegExp } from "@koine/utils";
import { createGenerator } from "../../compiler/createAdapter";

export default createGenerator("js", (arg) => {
  const { options } = arg;
  const { idDelimiter, optionalCatchAll, catchAll } = options.routes.tokens;

  return {
    pathnameToRouteId: {
      name: "pathnameToRouteId",
      ext: "ts",
      index: true,
      content: () => /* js */ `
/**
 * Convert a URL like pathname to a "named route"
 * E.g. it transforms:
 * - \`/dashboard/user/[id]\` into \`dashboard.user.[id]\`
 */
export const pathnameToRouteId = (pathname: string) =>
  pathname
    .replace(/^\\//g, "")
    .replace(/\\//g, "${idDelimiter}")
    .replace(/${escapeRegExp(idDelimiter)}${escapeRegExp(optionalCatchAll.start)}.+$/, "")
    .replace(/${escapeRegExp(idDelimiter)}${escapeRegExp(catchAll.start)}.+$/, "")
    .replace(/\\/index$/, "");

export default pathnameToRouteId;
`,
    },
  };
});

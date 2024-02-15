import { escapeRegExp } from "@koine/utils";
import type { I18nCompiler } from "../../compiler/types";

export default ({ options }: I18nCompiler.AdapterArg) => {
  const { idDelimiter, optionalCatchAll, catchAll } = options.routes.tokens;
  return `
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
`;
};

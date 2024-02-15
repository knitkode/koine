import type { I18nCompiler } from "../../compiler/types";

export default ({ options }: I18nCompiler.AdapterArg) => `
/**
 * Convert a URL like pathname to a "named route"
 * E.g. it transforms:
 * - \`/dashboard/user/[id]\` into \`dashboard.user.[id]\`
 */
export const pathnameToRouteId = (pathname: string) =>
  pathname
    .replace(/^\\//g, "")
    .replace(/\\//g, "${options.routes.tokens.idDelimiter}")
    .replace(/\\/index$/, "");

export default pathnameToRouteId;
`;

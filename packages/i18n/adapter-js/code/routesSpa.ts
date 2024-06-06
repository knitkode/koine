import type { I18nCompiler } from "../../compiler/types";

export default ({ routes }: I18nCompiler.AdapterArg<"js">) => {
  const value = JSON.stringify(
    Object.fromEntries(
      Object.entries(routes.byId)
        .filter(([, { pathnamesSpa }]) => !!pathnamesSpa)
        .map(([routeId, { pathnamesSpa }]) => [routeId, pathnamesSpa])
        .sort(),
    ),
    null,
    2,
  );
  return `
import type { I18n } from "./types";

/**
 * @internal
 */
export const routesSpa = ${value} as Record<string, string | Record<I18n.Locale, string>>;

export default routesSpa;
`;
};

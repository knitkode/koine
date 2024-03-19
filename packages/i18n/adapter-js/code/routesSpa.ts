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
export const routesSpa = ${value} as const;

export default routesSpa;
`;
};

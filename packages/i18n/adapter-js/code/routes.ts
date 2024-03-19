import type { I18nCompiler } from "../../compiler/types";

export default ({ routes }: I18nCompiler.AdapterArg<"js">) => {
  const value = JSON.stringify(
    Object.fromEntries(
      Object.entries(routes.byId)
        .map(([routeId, { pathnames }]) => [routeId, pathnames])
        .sort(),
    ),
    null,
    2,
  );
  return `
export const routes = ${value} as const;

export default routes;
`;
};

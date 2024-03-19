import type { I18nCompiler } from "../../compiler/types";

export default ({ routes }: I18nCompiler.AdapterArg<"js">) => {
  const value = JSON.stringify(
    Object.fromEntries(
      Object.entries(routes.byId)
        .map(([routeId, { pathnamesSlim, pathnames }]) => [
          routeId,
          pathnamesSlim || pathnames,
        ])
        .sort(),
    ),
    null,
    2,
  );
  return `
export const routesSlim = ${value} as const;

export default routesSlim;
`;
};

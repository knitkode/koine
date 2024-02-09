import type { I18nCompiler } from "../../compiler";

export default ({ routes }: I18nCompiler.AdapterArg) => {
  const value = JSON.stringify(
    Object.fromEntries(
      Object.entries(routes).map(
        ([routeId, { optimizedPathnames, pathnames }]) => [
          routeId,
          optimizedPathnames || pathnames,
        ],
      ),
    ),
    null,
    2,
  );
  return `
export const routesSlim = ${value} as const;

export default routesSlim;
`;
};

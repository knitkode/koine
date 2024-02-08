import type { I18nCompiler } from "../../compiler";

export default ({ data }: I18nCompiler.AdapterArg) => {
  const value = JSON.stringify(
    Object.fromEntries(
      Object.entries(data.code.routes).map(([routeId, { pathnames }]) => [
        routeId,
        pathnames,
      ]),
    ),
    null,
    2,
  );
  return `
export const routes = ${value} as const;

export default routes;
`;
};

import type { I18nGenerate } from "../types";

export default (data: I18nGenerate.Data) => {
  const value = JSON.stringify(
    Object.fromEntries(
      Object.entries(data.routes).map(([routeId, { pathnames }]) => [
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

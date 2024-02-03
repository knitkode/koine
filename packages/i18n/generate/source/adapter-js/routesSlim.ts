import type { I18nGenerate } from "../../types";

export default (data: I18nGenerate.Data) => {
  const value = JSON.stringify(
    Object.fromEntries(
      Object.entries(data.routes).map(([routeId, { optimizedPathnames }]) => [
        routeId,
        optimizedPathnames,
      ]),
    ),
    null,
    2,
  );
  return `
export const routesSlim = ${value} as const;
`;
};

import type { I18nCodegen } from "../../codegen";

export default (data: I18nCodegen.Data) => {
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

export default routesSlim;
`;
};

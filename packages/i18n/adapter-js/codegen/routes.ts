import type { I18nCodegen } from "../../codegen";

export default ({ data }: I18nCodegen.AdapterArg) => {
  const value = JSON.stringify(
    Object.fromEntries(
      Object.entries(data.source.routes).map(([routeId, { pathnames }]) => [
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

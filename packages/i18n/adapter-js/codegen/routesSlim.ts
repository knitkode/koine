import type { I18nCodegen } from "../../codegen";

export default ({ data }: I18nCodegen.AdapterArg) => {
  const value = JSON.stringify(
    Object.fromEntries(
      Object.entries(data.source.routes).map(
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

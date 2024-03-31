import type { I18nCompiler } from "../../compiler/types";

export default ({}: I18nCompiler.AdapterArg<"js">) => `

export type RouteIdError = (typeof routesError)[number];

/**
 * @internal
 */
export const routesError = [
  "404",
  "500",
  "403"
] as const;

/**
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isErrorRoute = (payload: any): payload is RouteIdError =>
  routesError.includes(payload);

// export default routesError;
`;

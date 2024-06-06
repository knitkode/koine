import type { I18nCompiler } from "../../compiler/types";

export default ({
  config: { baseUrl, trailingSlash },
}: I18nCompiler.AdapterArg<"js">) => `
/**
 * Returns an absolute normalised URL prepending the \`baseUrl\` i18n option to
 * the given pathname. It respects the \`trailingSlash\` option.
 * 
 * @param pathname Normalised, always prepended with a locale (if needed) and a slash
 */
export const formatUrl = (pathname: string) => "${baseUrl}" + ${trailingSlash ? `pathname` : `(pathname === "/" ? "" : pathname)`};

export default formatUrl;
`;

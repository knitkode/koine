import { createGenerator } from "../../compiler/createAdapter";

export default createGenerator("js", (arg) => {
  const {
    config: { baseUrl, trailingSlash },
  } = arg;
  return {
    formatUrl: {
      name: "formatUrl",
      ext: "ts",
      index: true,
      content: () => /* js */ `
/**
 * Returns an absolute normalised URL prepending the \`baseUrl\` i18n option to
 * the given pathname. It respects the \`trailingSlash\` option.
 * 
 * @param pathname Normalised, always prepended with a locale (if needed) and a slash
 */
export const formatUrl = (pathname: string) => "${baseUrl}" + ${trailingSlash ? `pathname` : `(pathname === "/" ? "" : pathname)`};

export default formatUrl;
`,
    },
  };
});

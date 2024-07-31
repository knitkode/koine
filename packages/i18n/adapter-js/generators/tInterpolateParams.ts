import { createGenerator } from "../../compiler/createAdapter";
import { escapeEachChar } from "../../compiler/helpers";

export default createGenerator("js", (arg) => {
  const { options } = arg;
  const { start, end } = options.translations.tokens.dynamicDelimiters;

  return {
    tInterpolateParams: {
      name: "tInterpolateParams",
      ext: "ts",
      content: () => /* js */ `
/**
 * @internal
 */
export let tInterpolateParams = (
  value: string,
  params?: object,
) =>
  params ? value.replace(
    /${escapeEachChar(start)}(.*?)${escapeEachChar(end)}/g,
    (_, key) =>
      params[key.trim() as keyof typeof params] + "",
  ) : value;

// export default tInterpolateParams;
`,
    },
  };
});

import { escapeEachChar } from "../../compiler/helpers";
import type { I18nCompiler } from "../../compiler/types";

export default ({ options }: I18nCompiler.AdapterArg<"js">) => {
  const { start, end } = options.translations.tokens.dynamicDelimiters;
  return `
/**
 * @internal
 */
/* eslint-disable prefer-const */
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
`;
};

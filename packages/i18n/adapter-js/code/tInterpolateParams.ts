import type { I18nCompiler } from "../../compiler/types";

const escapeEachChar = (input: string) =>
  input
    .split("")
    .map((v) => `\\${v}`)
    .join("");

export default ({ options }: I18nCompiler.AdapterArg) => {
  const { start, end } = options.translations.dynamicDelimiters;
  return `
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

export default tInterpolateParams;
`;
};

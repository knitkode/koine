import type { I18nCompiler } from "../../compiler";

const escapeEachChar = (input: string) =>
  input
    .split("")
    .map((v) => `\\${v}`)
    .join("");

export default ({ options }: I18nCompiler.AdapterArg) => {
  const { start, end } = options.translations.dynamicDelimiters;
  return `
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

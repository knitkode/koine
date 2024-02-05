import type { I18nCodegen } from "../../codegen";

const escapeEachChar = (input: string) =>
  input
    .split("")
    .map((v) => `\\${v}`)
    .join("");

export default (data: I18nCodegen.Data) => {
  const { start, end } = data.config.translations.dynamicDelimiters;
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

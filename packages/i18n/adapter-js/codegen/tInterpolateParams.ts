import type { I18nCodegen } from "../../codegen";

export default (data: I18nCodegen.Data) => {
  const { start, end } = data.config.translations.dynamicDelimiters;
  return `
export let tInterpolateParams = (
  value: string,
  params?: object,
) =>
  params ? value.replace(
    /\\${start}(.*?)\\${end}/g,
    (_, key) =>
      params[key as keyof typeof params] + "",
  ) : value;

export default tInterpolateParams;
`;
};

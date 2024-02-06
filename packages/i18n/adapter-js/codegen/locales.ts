import type { I18nCodegen } from "../../codegen";

export default (data: I18nCodegen.Data) => {
  const value = `[${data.config.locales.map((l) => `"${l}"`).join(", ")}]`;
  return `
export const locales = ${value} as const;

export default locales;
`;
};

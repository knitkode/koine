import type { I18nCodegen } from "../../codegen";

export default ({ config }: I18nCodegen.AdapterArg) => {
  const value = `[${config.locales.map((l) => `"${l}"`).join(", ")}]`;
  return `
export const locales = ${value} as const;

export default locales;
`;
};

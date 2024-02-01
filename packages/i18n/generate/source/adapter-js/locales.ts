import type { I18nGenerate } from "../../types";

export default (data: I18nGenerate.Data) => {
  const value = `[${data.locales.map((l) => `"${l}"`).join(", ")}]`;
  return `
export const locales = ${value} as const;

export default locales;`;
};

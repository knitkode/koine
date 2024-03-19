import type { I18nCompiler } from "../../compiler/types";

export default ({ config }: I18nCompiler.AdapterArg<"js">) => {
  const value = `[${config.locales.map((l) => `"${l}"`).join(", ")}]`;
  return `
export const locales = ${value} as const;

export default locales;
`;
};

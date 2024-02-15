// import type { I18nCompiler } from "../../compiler/types";

export default (/* {}: I18nCompiler.AdapterArg */) => {
  return `
/* eslint-disable prefer-const */
let pluralRules = new Intl.PluralRules();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export let tPluralise = (values: any, count: number) =>
  values[count] || values[pluralRules.select(count)] || values["other"];

export default tPluralise;
`;
};

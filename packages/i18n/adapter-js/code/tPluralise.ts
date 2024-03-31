import type { I18nCompiler } from "../../compiler/types";

export default ({}: I18nCompiler.AdapterArg<"js">) => {
  return `
/* eslint-disable prefer-const */
let pluralRules = new Intl.PluralRules();

/**
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export let tPluralise = (values: any, count: number) =>
  values[count] || values[pluralRules.select(count)] || (count === 0 ? values.zero : values["other"]);

// export default tPluralise;
`;
};

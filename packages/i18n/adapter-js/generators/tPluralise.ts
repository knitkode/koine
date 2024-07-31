import { createGenerator } from "../../compiler/createAdapter";

export default createGenerator("js", (_arg) => {
  return {
    tPluralise: {
      name: "tPluralise",
      ext: "ts",
      content: () => /* js */ `
let pluralRules = new Intl.PluralRules();

/**
 * @internal
 */
export let tPluralise = (values: any, count: number) =>
  values[count] || values[pluralRules.select(count)] || (count === 0 ? values.zero : values["other"]);

// export default tPluralise;
`,
    },
  };
});

import { createGenerator } from "../../compiler/createAdapter";
import { FunctionsCompiler } from "../../compiler/functions";

export const tPluralise = () =>
  new FunctionsCompiler({
    imports: [],
    before: `let pluralRules = new Intl.PluralRules();`,
    comment: { internal: true },
    name: "tPluralise",
    args: [
      { name: "values", type: "any", optional: false },
      { name: "count", type: "number", optional: false },
    ],
    body: `values[count] || values[pluralRules.select(count)] || (count === 0 ? values.zero : values["other"])`,
  });

export default createGenerator("js", (_arg) => {
  return {
    tPluralise: {
      name: "tPluralise",
      ext: "ts",
      index: false,
      content: () => `

${tPluralise().$out("ts", { imports: false, exports: "named" })}
`,
      // TODO: cleanup commented old impl
      // content: () => /* j s */`
      // let pluralRules = new Intl.PluralRules();

      // /**
      //  * @internal
      //  */
      // export let tPluralise = (values: any, count: number) =>
      //   values[count] || values[pluralRules.select(count)] || (count === 0 ? values.zero : values["other"]);

      // // export default tPluralise;
      // `,
    },
  };
});

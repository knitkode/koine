import { createGenerator } from "../../compiler/createAdapter";
import { FunctionsCompiler } from "../../compiler/functions";

export const tPluralise = () =>
  new FunctionsCompiler({
    imports: [],
    before: `let pluralRules = new Intl.PluralRules();\n\n`,
    comment: { internal: true },
    name: "tPluralise",
    args: [
      { name: "values", type: "any", optional: false },
      { name: "count", type: "number", optional: false },
    ],
    body: `values[count] || values[pluralRules.select(count)] || (count === 0 ? values.zero : values["other"])`,
    implicitReturn: true,
  });

export default createGenerator("js", (_arg) => {
  return {
    tPluralise: {
      dir: createGenerator.dirs.internal,
      name: "tPluralise",
      ext: "ts",
      index: false,
      content: () =>
        tPluralise().$out("ts", { imports: { folderUp: 0 }, exports: "named" }),
    },
  };
});

import { createGenerator } from "../../compiler/createAdapter";
import { FunctionsCompiler } from "../../compiler/functions";

export const tPluralise = () =>
  new FunctionsCompiler({
    imports: [],
    before: `let pluralRules = new Intl.PluralRules();\n\n`,
    comment: { internal: true },
    name: "tPluralise",
    generics: [
      { name: "T", type: "{ [pluralKey: string]: string | number | boolean }" },
    ],
    args: [
      { name: "values", type: "T", optional: false },
      { name: "count", type: "number", optional: false },
    ],
    returns: { name: "T[keyof T]", explicit: true },
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
        tPluralise().$out("ts", { imports: {}, exports: "named" }),
    },
  };
});

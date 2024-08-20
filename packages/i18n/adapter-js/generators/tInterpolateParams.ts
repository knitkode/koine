import { createGenerator } from "../../compiler/createAdapter";
import { FunctionsCompiler } from "../../compiler/functions";
import { escapeEachChar } from "../../compiler/helpers";

export const tInterpolateParams = ({
  start,
  end,
}: {
  start: string;
  end: string;
}) =>
  new FunctionsCompiler({
    imports: [],
    comment: { internal: true },
    name: "tInterpolateParams",
    generics: [{ name: "T", type: "string | number | boolean" }],
    args: [
      { name: "value", type: "T", optional: false },
      { name: "params", type: "object", optional: true },
    ],
    returns: { name: "T" },
    body: ({ format }) => `params ? value.replace(
    /${escapeEachChar(start)}(.*?)${escapeEachChar(end)}/g,
    (_, key) =>
      params[key.trim()${format === "ts" ? " as keyof typeof params" : ""}] + "",
  ) : value`,
    implicitReturn: true,
  });

export default createGenerator("js", (arg) => {
  const { options } = arg;
  const { dynamicDelimiters } = options.translations.tokens;

  return {
    tInterpolateParams: {
      dir: createGenerator.dirs.internal,
      name: "tInterpolateParams",
      ext: "ts",
      index: false,
      content: () =>
        tInterpolateParams(dynamicDelimiters).$out("ts", {
          imports: false,
          exports: "named",
        }),
    },
  };
});

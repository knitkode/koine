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
    args: [
      { name: "value", type: "string", optional: false },
      { name: "params", type: "object", optional: true },
    ],
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
  // const { start, end } = dynamicDelimiters;

  return {
    tInterpolateParams: {
      name: "tInterpolateParams",
      ext: "ts",
      index: false,
      content: () =>
        tInterpolateParams(dynamicDelimiters).$out("ts", {
          imports: false,
          exports: "named",
        }),
      // TODO: cleanup commented old impl
      // content: () => /* j s */`
      // /**
      //  * @internal
      //  */
      // export let tInterpolateParams = (
      //   value: string,
      //   params?: object,
      // ) =>
      //   params ? value.replace(
      //     /${escapeEachChar(start)}(.*?)${escapeEachChar(end)}/g,
      //     (_, key) =>
      //       params[key.trim() as keyof typeof params] + "",
      //   ) : value;

      // // export default tInterpolateParams;
      // `,
    },
  };
});

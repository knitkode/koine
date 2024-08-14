import { createGenerator } from "../../compiler/createAdapter";
import { FunctionsCompiler } from "../../compiler/functions";
import { tInterpolateParams } from "./tInterpolateParams";

export const tInterpolateParamsDeep = ({
  start,
  end,
}: {
  start: string;
  end: string;
}) =>
  new FunctionsCompiler({
    imports: [],
    comment: { internal: true },
    name: "tInterpolateParamsDeep",
    args: [
      { name: "value", type: "string | object | Array", optional: false },
      { name: "params", type: "object", optional: true },
    ],
    // before: ({ format }) => tInterpolateParams({ start, end }).$out(format, {
    //   exports: false,
    //   imports: false,
    //   comments: false,
    //   style: "arrow",
    // }),
    body: ({ format }) =>
      [
        tInterpolateParams({ start, end }).$out(format, {
          exports: false,
          imports: false,
          comments: false,
          style: "arrow",
        }),
        `if (Array.isArray(value)) {`,
        `  for (let i = 0; i < value.length; i++) {`,
        `    value[i] = tInterpolateParamsDeep(value[i], params);`,
        `  }`,
        `} else if (typeof value === "object") {`,
        `  for (const key in value) {`,
        `    value[key] = tInterpolateParamsDeep(value[key], params);`,
        `  }`,
        `} else {`,
        ` value = tInterpolateParams(value, params);`,
        `}`,
        `return value;`,
      ].join(" "),
  });

export default createGenerator("js", (arg) => {
  const { options } = arg;
  const { dynamicDelimiters } = options.translations.tokens;

  return {
    tInterpolateParamsDeep: {
      name: "tInterpolateParamsDeep",
      ext: "ts",
      index: false,
      content: () =>
        tInterpolateParamsDeep(dynamicDelimiters).$out("ts", {
          imports: false,
          exports: "named",
          style: "function",
        }),
    },
  };
});

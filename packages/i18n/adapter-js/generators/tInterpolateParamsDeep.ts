import { createGenerator } from "../../compiler/createAdapter";
import { FunctionsCompiler } from "../../compiler/functions";
import { ImportsCompiler } from "../../compiler/imports";

export const tInterpolateParamsDeep = () =>
  new FunctionsCompiler({
    imports: [
      new ImportsCompiler({
        path: "tInterpolateParams",
        named: [{ name: "tInterpolateParams" }],
      }),
    ],
    comment: { internal: true },
    name: "tInterpolateParamsDeep",
    generics: [{ name: "T", type: "string | object | unknown[]" }],
    args: [
      { name: "value", type: "T", optional: false },
      { name: "params", type: "object", optional: true },
    ],
    returns: { name: "T" },
    // before: ({ format }) => tInterpolateParams({ start, end }).$out(format, {
    //   exports: false,
    //   imports: false,
    //   comments: false,
    //   style: "arrow",
    // }),
    body: () =>
      [
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

export default createGenerator("js", (_arg) => {
  return {
    tInterpolateParamsDeep: {
      dir: createGenerator.dirs.internal,
      name: "tInterpolateParamsDeep",
      ext: "ts",
      index: false,
      disabled: true,
      content: () =>
        tInterpolateParamsDeep().$out("ts", {
          imports: {},
          exports: "named",
          style: "function",
        }),
    },
  };
});

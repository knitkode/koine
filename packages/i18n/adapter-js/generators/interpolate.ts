import { createGenerator } from "../../compiler/createAdapter";
import { FunctionsCompiler } from "../../compiler/functions";
import { escapeEachChar } from "../../compiler/helpers";
import { ImportsCompiler } from "../../compiler/imports";

export const i18nInterpolateParamsCompiler = ({
  start,
  end,
}: {
  start: string;
  end: string;
}) =>
  new FunctionsCompiler({
    imports: [],
    comment: { internal: true },
    name: "i18nInterpolateParams",
    generics: [{ name: "T", type: "string | number | boolean" }],
    args: [
      { name: "value", type: "T", optional: false },
      { name: "params", type: "object", optional: true },
    ],
    returns: { name: "T" },
    body: ({ format }) => `params ? value.replace(
    /${escapeEachChar(start)}(.*?)${escapeEachChar(end)}/g,
    (_, key) =>
      (params[key.trim()${format === "ts" ? " as keyof typeof params" : ""}] || "{{" + key + "}}") + "",
  ) : value`,
    implicitReturn: true,
  });

export const i18nInterpolateParamsDeepCompiler = () =>
  new FunctionsCompiler({
    imports: [
      new ImportsCompiler({
        path: "i18nInterpolateParams",
        named: [{ name: "i18nInterpolateParams" }],
      }),
    ],
    comment: { internal: true },
    name: "i18nInterpolateParamsDeep",
    generics: [{ name: "T", type: "string | object | unknown[]" }],
    args: [
      { name: "value", type: "T", optional: false },
      { name: "params", type: "object", optional: true },
    ],
    returns: { name: "T" },
    // before: ({ format }) => i18nInterpolateParams({ start, end }).$out(format, {
    //   exports: false,
    //   imports: false,
    //   comments: false,
    //   style: "arrow",
    // }),
    body: () =>
      [
        `if (Array.isArray(value)) {`,
        `  for (let i = 0; i < value.length; i++) {`,
        `    value[i] = i18nInterpolateParamsDeep(value[i], params);`,
        `  }`,
        `} else if (typeof value === "object") {`,
        `  for (const key in value) {`,
        `    value[key] = i18nInterpolateParamsDeep(value[key], params);`,
        `  }`,
        `} else {`,
        ` value = i18nInterpolateParams(value, params);`,
        `}`,
        `return value;`,
      ].join(" "),
  });

export default createGenerator("js", (arg) => {
  const { options } = arg;
  const { dynamicDelimiters } = options.translations.tokens;

  return {
    i18nInterpolateParams: {
      dir: createGenerator.dirs.internal,
      name: "i18nInterpolateParams",
      ext: "ts",
      index: false,
      disabled: true,
      content: () =>
        i18nInterpolateParamsCompiler(dynamicDelimiters).$out("ts", {
          imports: false,
          exports: "named",
        }),
    },
    i18nInterpolateParamsDeep: {
      dir: createGenerator.dirs.internal,
      name: "i18nInterpolateParamsDeep",
      ext: "ts",
      index: false,
      disabled: true,
      content: () =>
        i18nInterpolateParamsDeepCompiler().$out("ts", {
          imports: {},
          exports: "named",
          style: "function",
        }),
    },
  };
});

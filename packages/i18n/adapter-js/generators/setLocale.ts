import { createGenerator } from "../../compiler/createAdapter";
import { FunctionsCompiler } from "../../compiler/functions";
import { GLOBAL_I18N_IDENTIFIER } from "../../compiler/helpers";
import { ImportsCompiler } from "../../compiler/imports";

export const setGlobalLocale = (_options?: never) =>
  new FunctionsCompiler({
    imports: [
      new ImportsCompiler({
        path: "types",
        named: [{ name: "I18n", type: true }],
      }),
    ],
    name: "setGlobalLocale",
    args: [{ name: "value", type: "I18n.Locale", optional: false }],
    before: ({ format }) =>
      format === "ts"
        ? `declare global {
  var ${GLOBAL_I18N_IDENTIFIER}: I18n.Locale;
}
`
        : "",
    comment: { internal: true },
    body: `global.${GLOBAL_I18N_IDENTIFIER} = value`,
    implicitReturn: true,
  });

export default createGenerator("js", (_arg) => {
  return {
    setGlobalLocale: {
      dir: "internal",
      name: "setGlobalLocale",
      ext: "ts",
      index: false,
      content: () =>
        setGlobalLocale().$out("ts", {
          imports: { folderUp: 1 },
          exports: "named",
        }),
    },
  };
});

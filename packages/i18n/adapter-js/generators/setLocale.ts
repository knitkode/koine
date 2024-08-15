import { createGenerator } from "../../compiler/createAdapter";
import { FunctionsCompiler } from "../../compiler/functions";
import { GLOBAL_I18N_IDENTIFIER } from "../../compiler/helpers";
import { getImportTypes } from "./types";

export const setGlobalLocale = (_options?: never) =>
  new FunctionsCompiler({
    imports: [getImportTypes()],
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
    globals: {
      dir: createGenerator.dirs.internal,
      name: "globals",
      ext: "d.ts",
      index: false,
      content: () => `
declare global {
  var ${GLOBAL_I18N_IDENTIFIER}: import("../types").I18n.Locale;
}
`,
    },
    setGlobalLocale: {
      dir: createGenerator.dirs.internal,
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

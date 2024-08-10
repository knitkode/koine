import { createGenerator } from "../../compiler/createAdapter";
import { FunctionsCompiler } from "../../compiler/functions";

export const setGlobalLocale = (_options?: never) =>
  new FunctionsCompiler({
    imports: [],
    name: "setGlobalLocale",
    args: [{ name: "value", type: "string", optional: false }],
    before: ({ format }) =>
      format === "ts"
        ? `
declare global {
  var __i18n_locale: I18n.Locale;
}`
        : "",
    body: `global.__i18n_locale = value;`,
  });

export default createGenerator("js", (_arg) => {
  return {
    setGlobalLocale: {
      dir: "internal",
      name: "setGlobalLocale",
      ext: "ts",
      index: false,
      content: () => `
/**
 * @internal
 */
${setGlobalLocale().$out("ts", { imports: false, exports: "named" })}
`,
    },
  };
});

import { createGenerator } from "../../compiler/createAdapter";
import { FunctionsCompiler } from "../../compiler/functions";
// import { ImportsCompiler } from "../../compiler/imports";
import type { I18nCompiler } from "../../compiler/types";

export const formatTo = (
  {
    defaultLocale,
    hideDefaultLocaleInUrl,
    // trailingSlash TODO: implement trailingSlash option
  }: Pick<
    I18nCompiler.Config,
    "defaultLocale" | "hideDefaultLocaleInUrl" | "trailingSlash"
  >,
  devDebug?: boolean,
) =>
  new FunctionsCompiler({
    // NOTE: we could import `defaultLocale` but it's cleaner and easier to
    // manage by inlining it, especially when we want to inline the output of
    // this compiled function
    imports: [],
    comment: { internal: true },
    name: "formatTo",
    generics: [{ name: "T", type: "string" }],
    args: [
      { name: "locale", type: "string | undefined", optional: false },
      { name: "pathname", type: "T", optional: false },
      { name: "params", type: "object", optional: true },
    ],
    returns: {
      name: "T",
      explicit: true,
    },
    body: ({ format }) =>
      `
  locale = locale || "${defaultLocale}";
      ${
        devDebug
          ? `
  if (process.env["NODE_ENV"] === "development") {
    if (params) {
      pathname.replace(/\\[(.*?)\\]/g, (_, dynamicKey) => {
        const key = dynamicKey${format === "ts" ? " as Extract<keyof typeof params, string>" : ""};

        if (!(key in params)) {
          console.warn(
            "[@koine/i18n]:formatTo, using '" +
              pathname +
              "' without param '" +
              key +
              "'",
              { params }
          );
        }

        if (!["string", "number"].includes(typeof params[key])) {
          console.warn(
            "[@koine/i18n]:formatTo, using '" +
              pathname +
              "' with unserializable param  '" +
              key +
              "' (type '" +
              Object.prototype.toString.call((params[key])).slice(8, -1) +
              "')",
          );
        }
        return "";
      });
    }
  }
`
          : ``
      }` +
      `
  if (params) {
    pathname = pathname.replace(/\\[(.*?)\\]/g, (_, key) => params[key${format === "ts" ? " as keyof typeof params" : ""}] + "")
  }
  ${
    hideDefaultLocaleInUrl
      ? `
  if (locale !== "${defaultLocale}") {
    return "/" + locale + (pathname === "/" ? "" : pathname);
  }
  `
      : ``
  }
  return pathname;
`,
  });

export default createGenerator("js", (arg) => {
  const { config } = arg;
  return {
    formatTo: {
      dir: createGenerator.dirs.internal,
      name: "formatTo",
      ext: "ts",
      index: false,
      content: () =>
        formatTo(config, true).$out("ts", {
          imports: { folderUp: 0 },
          exports: "named",
        }),
    },
  };
});

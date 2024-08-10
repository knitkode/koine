import { ImportsCompiler, type ImportsCompilerOutputOptions } from "./imports";

export type FunctionsCompilerData = {
  imports: ImportsCompiler[];
  /**
   * Code to output before function declaration
   */
  before?: string | ((options: { format: FunctionsCompilerFormat }) => string);
  /**
   * Function JsDoc block comment `/** * /` {@link FunctionsCompilerComment}
   */
  comment?: FunctionsCompilerComment;
  /**
   * The function name (`myFn` in `myFn(myArg?: MyArg) { return "x" }`)
   */
  name: string;
  /**
   * The function arguments (list of {@link FunctionsCompilerDataArg})
   */
  args: FunctionsCompilerDataArg[];
  /**
   * The function body (`return "x";` in `myFn(myArg?: MyArg) { return "x"; }`)
   */
  body: string | ((options: { format: FunctionsCompilerFormat }) => string);
};

type FunctionsCompilerComment = {
  /**
   * Add `@internal` comment directive
   */
  internal?: boolean;
};

export type FunctionsCompilerDataArg = {
  /**
   * The argument name value (`myArg` in `myFn(myArg?: MyArg) {}`)
   */
  name: string;
  /**
   * The argument type value (as string) (`MyArg` in `myFn(myArg?: MyArg) {}`)
   */
  type: string;
  /**
   * Whether the argument is optional (`?` in `myFn(myArg?: MyArg) {}`)
   */
  optional: boolean;
};

type FunctionsCompilerOutputOptions = {
  /**
   * Imports output options, pass `false` to do not output import' statements
   */
  imports: false | ImportsCompilerOutputOptions;
  /**
   * How the function is exported
   */
  exports: false | "named" | "default" | "both";
  /**
   * Whether to print the function's block comment (if any)
   *
   * @default true
   */
  comments?: boolean;
};

type FunctionsCompilerOutputOptionsResolved = ReturnType<
  typeof FunctionsCompiler.resolveOptions
>;

type FunctionsCompilerFormat = "ts" | "cjs";

export class FunctionsCompiler {
  name: FunctionsCompilerDataArg["name"];
  data: FunctionsCompilerData;

  constructor(data: FunctionsCompilerData) {
    this.name = data.name;
    this.data = data;
  }

  static #args(args: FunctionsCompilerDataArg[], withTypes: boolean) {
    return args
      .map((arg) =>
        withTypes
          ? `${arg.name}${arg.optional ? "?" : ""}: ${arg.type}`
          : arg.name,
      )
      .join(", ");
  }

  static #comment({ internal }: FunctionsCompilerComment) {
    let lines = [];
    if (internal) lines.push("@internal");

    return lines.length ? `/**\n * ${lines.join("\n * ")}\n */\n` : "";
  }

  static resolveOptions(options: FunctionsCompilerOutputOptions) {
    const {
      imports: optsIm,
      exports: optsEx,
      comments: optsCo = true,
    } = options;
    return {
      optsIm,
      optsEx,
      optsCo,
    };
  }

  static #getBefore(
    data: FunctionsCompilerData,
    format: FunctionsCompilerFormat,
  ) {
    const { before } = data;
    return before
      ? typeof before === "function"
        ? before({ format })
        : before
      : "";
  }

  static #getBody(
    data: FunctionsCompilerData,
    format: FunctionsCompilerFormat,
  ) {
    const { body } = data;
    return (typeof body === "function" ? body({ format }) : body) + "\n\n";
  }

  /**
   * TypeScript output
   */
  static #ts(
    data: FunctionsCompilerData,
    options: FunctionsCompilerOutputOptionsResolved,
  ) {
    const { imports, comment, name, args } = data;
    const { optsIm, optsEx, optsCo } = options;
    let out =
      optsIm && imports.length
        ? imports.map((i) => i.$out("ts", optsIm)).join("\n") + "\n\n"
        : "";
    out += this.#getBefore(data, "ts");
    out += optsCo && comment ? this.#comment(comment) : "";
    out += optsEx === "named" || optsEx === "both" ? "export " : "";
    out += `let ${name} = (${this.#args(args, true)}) => `;
    out += this.#getBody(data, "ts") + ";";
    out +=
      optsEx === "default" || optsEx === "both"
        ? "\n\nexport default " + name + ";"
        : "";
    return out;
  }

  /**
   * CommonJS output
   */
  static #cjs(
    data: FunctionsCompilerData,
    options: FunctionsCompilerOutputOptionsResolved,
  ) {
    const { imports, comment, name, args } = data;
    const { optsIm, optsEx, optsCo } = options;
    let out =
      optsIm && imports.length
        ? imports.map((i) => i.$out("cjs", optsIm)).join("\n") + "\n\n"
        : "";
    out += this.#getBefore(data, "cjs");
    out += optsCo && comment ? this.#comment(comment) : "";
    out += `let ${name} = (${this.#args(args, false)}) => `;
    out += this.#getBody(data, "cjs") + ";";
    out +=
      optsEx === "named" || optsEx === "both"
        ? `\n\nexports.${name} = ${name};`
        : "";
    out +=
      optsEx === "default" || optsEx === "both"
        ? "\n\nmodule.exports = " + name + ";"
        : "";
    return out;
  }

  $out(
    format: FunctionsCompilerFormat,
    options: FunctionsCompilerOutputOptions,
  ) {
    return FunctionsCompiler.out(this.data, format, options);
  }

  static out(
    data: FunctionsCompilerData,
    format: FunctionsCompilerFormat,
    options: FunctionsCompilerOutputOptions,
  ) {
    const resolvedOptions = this.resolveOptions(options);
    if (format === "ts") return this.#ts(data, resolvedOptions);
    if (format === "cjs") return this.#cjs(data, resolvedOptions);
    return "";
  }

  static outMany(
    format: FunctionsCompilerFormat,
    instances: FunctionsCompiler[] | Set<FunctionsCompiler>,
    options: FunctionsCompilerOutputOptions,
  ) {
    const list = Array.from(instances);
    return list.length
      ? list.map((i) => this.out(i.data, format, options)).join("\n")
      : "";
  }
}

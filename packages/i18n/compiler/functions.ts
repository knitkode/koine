import { ImportsCompiler, type ImportsCompilerOutputOptions } from "./imports";

export type FunctionsCompilerData = {
  imports: ImportsCompiler[];
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
  body: string;
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
};

export class FunctionsCompiler {
  name: FunctionsCompilerDataArg["name"];
  data: FunctionsCompilerData;

  constructor(data: FunctionsCompilerData) {
    this.name = data.name;
    this.data = data;
  }

  static #args(args: FunctionsCompilerDataArg[], withTypes: boolean) {
    return args.map((arg) =>
      withTypes
        ? `${arg.name}${arg.optional ? "?" : ""}: ${arg.type}`
        : arg.name,
    );
  }

  static #ts(
    data: FunctionsCompilerData,
    options: FunctionsCompilerOutputOptions,
  ) {
    const { imports, name, args, body } = data;
    const { imports: optsIm, exports: optsEx } = options;
    let out =
      optsIm && imports.length
        ? imports.map((i) => i.$out("ts", optsIm)).join("\n") + "\n\n"
        : "";
    out += optsEx === "named" || optsEx === "both" ? "export " : "";
    out += `let ${name} = (${this.#args(args, true)}) => `;
    out += body;
    out +=
      optsEx === "default" || optsEx === "both"
        ? "\n\nexport default " + name
        : "";
    return out;
  }

  $out(format: "ts", options: FunctionsCompilerOutputOptions) {
    if (format === "ts") return FunctionsCompiler.#ts(this.data, options);
    return "";
  }

  static out(
    data: FunctionsCompilerData,
    format: "ts",
    options: FunctionsCompilerOutputOptions,
  ) {
    if (format === "ts") return this.#ts(data, options);
    return "";
  }

  static outMany(
    format: "ts",
    instances: FunctionsCompiler[] | Set<FunctionsCompiler>,
    options: FunctionsCompilerOutputOptions,
  ) {
    const list = Array.from(instances);
    return list.length
      ? list.map((i) => this.out(i.data, format, options)).join("\n")
      : "";
  }
}

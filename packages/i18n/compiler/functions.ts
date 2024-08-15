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
  /**
   * Whether the function body should automatically prepend a `return ` statement
   * in case of a **traditional** function expression or by using [an _expression body_
   * rather than a _block body_](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#function_body)
   * in case of an **arrow** function expression
   */
  implicitReturn?: boolean;
};

type FunctionsCompilerComment = {
  title?: string;
  body?: string;
  /**
   * Add `@internal` comment directive
   */
  internal?: boolean;
  returns?: string;
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
  /**
   * @default "arrow"
   */
  style?: "arrow" | "function";
  /**
   * Whether to add bundler's comments hint [`__NO_SIDE_EFFECTS__`](https://github.com/javascript-compiler-hints/compiler-notations-spec/blob/main/no-side-effects-notation-spec.md)
   *
   * NOTE: [`__PURE__` can only annotate function calls](https://github.com/javascript-compiler-hints/compiler-notations-spec/blob/main/pure-notation-spec.md)
   *
   * @default false
   */
  pure?: boolean;
};

type FunctionsCompilerOutputOptionsResolved = ReturnType<
  typeof FunctionsCompiler.resolveOptions
>;

type FunctionsCompilerFormat = "ts" | "cjs";

function splitTextLines(text: string, lineMaxChars: number) {
  const regex = new RegExp(
    `\\b\\w(?:[\\w\\s]{${lineMaxChars - 1},}?(?=\\s)|.*$)`,
    "g",
  );

  return text.match(regex);
}

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

  static #comment(data: FunctionsCompilerData) {
    const { args, comment = {} } = data;
    const { title, body, internal, returns } = comment;
    let lines = [];

    if (title) {
      lines.push("### " + title);
      lines.push("");
    }
    if (body) {
      splitTextLines(body, 80)?.forEach((l) => lines.push(l));
      lines.push("");
    }

    if (internal) lines.push("@internal");

    args.forEach((arg) => {
      lines.push(`@param {${arg.type}${arg.optional ? "?" : ""}} ${arg.name}`);
    });
    if (returns) lines.push("@return " + returns);

    return lines.length ? `/**\n * ${lines.join("\n * ")}\n */\n` : "";
  }

  static #pure(options: FunctionsCompilerOutputOptionsResolved) {
    return options.opts_pure ? "/* @__NO_SIDE_EFFECTS__ */\n" : "";
  }

  static resolveOptions(options: FunctionsCompilerOutputOptions) {
    const {
      imports: opts_imports,
      exports: opts_exports,
      comments: opts_comments = true,
      style: opts_style = "arrow",
      pure: opts_pure,
    } = options;
    return {
      opts_imports,
      opts_exports,
      opts_comments,
      opts_style,
      opts_pure,
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
    options: FunctionsCompilerOutputOptionsResolved,
    format: FunctionsCompilerFormat,
  ) {
    const { body, implicitReturn } = data;
    const { opts_style } = options;
    let out = typeof body === "function" ? body({ format }) : body;
    if (implicitReturn) {
      if (opts_style === "function") {
        out = " return " + out + ";";
      }
    } else {
      if (opts_style === "arrow") {
        out = "{ " + out + "}";
      }
    }

    return out;
  }

  /**
   * TypeScript output
   */
  static #ts(
    data: FunctionsCompilerData,
    options: FunctionsCompilerOutputOptionsResolved,
  ) {
    const { imports, name, args } = data;
    const { opts_imports, opts_exports, opts_comments, opts_style } = options;
    let out =
      opts_imports && imports.length
        ? imports.map((i) => i.$out("ts", opts_imports)).join("\n") + "\n\n"
        : "";
    out += this.#getBefore(data, "ts");
    out += opts_comments ? this.#comment(data) : "";
    out += this.#pure(options);

    // maybe add named export
    out += opts_exports === "named" || opts_exports === "both" ? "export " : "";

    if (opts_style === "arrow") {
      out += `let ${name} = (${this.#args(args, true)}) => `;
      out += this.#getBody(data, options, "ts") + ";";
    } else if (opts_style === "function") {
      out += `function ${name}(${this.#args(args, true)}) {`;
      out += this.#getBody(data, options, "ts") + "}";
    }

    // maybe add default export
    out +=
      opts_exports === "default" || opts_exports === "both"
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
    const { imports, name, args } = data;
    const { opts_imports, opts_exports, opts_comments, opts_style } = options;
    let out =
      opts_imports && imports.length
        ? imports.map((i) => i.$out("cjs", opts_imports)).join("\n") + "\n\n"
        : "";
    out += this.#getBefore(data, "cjs");
    out += opts_comments ? this.#comment(data) : "";
    out += this.#pure(options);

    if (opts_style === "arrow") {
      out += `let ${name} = (${this.#args(args, false)}) => `;
      out += this.#getBody(data, options, "cjs") + ";";
    } else if (opts_style === "function") {
      out += `function ${name}(${this.#args(args, false)}) {`;
      out += this.#getBody(data, options, "cjs") + "}";
    }

    // maybe add named export
    out +=
      opts_exports === "named" || opts_exports === "both"
        ? `\n\nexports.${name} = ${name};`
        : "";

    // maybe add default export
    out +=
      opts_exports === "default" || opts_exports === "both"
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

  $outInline() {
    return FunctionsCompiler.out(this.data, "cjs", {
      exports: false,
      imports: false,
      comments: false,
      style: "function",
    });
  }

  /**
   * @private To use in tests only
   */
  $createTestableFn(before = "") {
    const source = this.$out("cjs", {
      exports: false,
      imports: false,
      comments: false,
      style: "function",
    });
    return new Function(before + " return " + source)();
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
      ? list.map((i) => this.out(i.data, format, options)).join("\n\n")
      : "";
  }
}

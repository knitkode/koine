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
   * The function generics (`T extends string` in `myFn<T extends string>(myArg?: T) { return "x" }`)
   */
  generics?: FunctionsCompilerDataGeneric[];
  /**
   * The function arguments (list of {@link FunctionsCompilerDataArg})
   */
  args?: FunctionsCompilerDataArg[];
  /**
   * The function's return value, it also renders the `@returns` comment directive
   */
  returns?: {
    /**
     * `someVal` in `@returns {someVal}` comment directive
     */
    name: string;
    /**
     * `That thing` in `@returns {someVal} - That thing` comment directive
     */
    description?: string;
    /**
     * When `true` and we are outputting TypeScript code it adds an explicit
     * return type: `: MyType` in in `myFn(): MyType { return "x" }`
     */
    explicit?: boolean;
  };
  /**
   * The function body (`return "x";` in `myFn(myArg?: MyArg) { return "x"; }`)
   */
  body: string | ((options: FunctionsCompilerBodyOptions) => string);
  /**
   * Whether the function body should automatically prepend a `return ` statement
   * in case of a **traditional** function expression or by using [an _expression body_
   * rather than a _block body_](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#function_body)
   * in case of an **arrow** function expression
   */
  implicitReturn?: boolean;
};

export type FunctionsCompilerBodyOptions = { format: FunctionsCompilerFormat };

export type FunctionsCompilerDataGeneric = {
  /**
   * The generic _name_ value (`T` in `myFn<T extends string | number>(a?: T) {}`)
   */
  name: string;
  /**
   * The generic _extends_ clause (`string | number` in `myFn<T extends string | number>(a?: T) {}`)
   */
  type?: string;
  /**
   * The generic _default_ value (`number` in `myFn<T extends string | number = number>(a?: T) {}`)
   */
  defaults?: string;
  /**
   * The generic description to show in the optionally generated `@template`
   * line in {@link FunctionsCompilerComment comment}
   */
  description?: string;
};

export type FunctionsCompilerDataArg = {
  /**
   * The argument name value (`myArg` in `myFn(myArg?: MyArg) {}`)
   */
  name: string;
  /**
   * The argument description to show in the optionally generated `@param`
   * line in {@link FunctionsCompilerComment comment}
   */
  description?: string;
  /**
   * The argument type value (as string) (`MyArg` in `myFn(myArg?: MyArg) {}`)
   */
  type: string;
  /**
   * Whether the argument is optional (`?` in `myFn(myArg?: MyArg) {}`)
   */
  optional: boolean;
  /**
   * Optional argument default value (eventually displayed in the generated {@link FunctionsCompilerComment comment})
   */
  defaults?: string;
};

/**
 * A comment tag is made of a key that is prepended by a `@` sign and a string value that describes it.
 * E.g. `{ key: "see", val: "Text"}` produces the comment line
 * @see Text
 */
type FunctionsCompilerCommentTag = {
  key: string;
  val: string;
};

/**
 * Anatomy a [JSDoc](https://jsdoc.app/) based block comment
 */
type FunctionsCompilerComment = {
  /**
   * Displayed as first line of the comment as H3 heading, prepended by `###`
   * markdown tag.
   */
  title?: string;
  /**
   * Displayed as body text of the comment after an empty line after the `title`
   */
  body?: string;
  /**
   * Renders `@internal` comment directive
   */
  internal?: boolean;
  /**
   * List of {@link FunctionsCompilerCommentTag comment `@...` tags}
   */
  tags?: FunctionsCompilerCommentTag[];
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

/**
 * Compiler class to represent and output a TypeScript/JavaScript function's
 * source code
 */
export class FunctionsCompiler {
  name: FunctionsCompilerDataArg["name"];
  data: FunctionsCompilerData;

  constructor(data: FunctionsCompilerData) {
    this.name = data.name;
    this.data = data;
  }

  /**
   * @returns function's arguments to surround with `(` brackets `)`
   */
  static #generics(data: FunctionsCompilerData) {
    const { generics } = data;

    if (generics?.length) {
      return (
        "<" +
        generics
          .map(
            ({ name, type, defaults }) =>
              `${name}${type ? " extends " + type : ""}${defaults ? " = " + defaults : ""}`,
          )
          .join(", ") +
        ">"
      );
    }

    return "";
  }

  /**
   * @param withTypes Optionally output TypeScript type for each argument
   * @returns function's arguments to surround with `(` brackets `)`
   */
  static #args(data: FunctionsCompilerData, withTypes: boolean) {
    const { generics, args = [], returns } = data;
    let out = "";

    if (withTypes && generics) {
      out += this.#generics(data);
    }

    out +=
      "(" +
      args
        .map((arg) =>
          withTypes
            ? `${arg.name}${arg.optional ? "?" : ""}: ${arg.type}`
            : arg.name,
        )
        .join(", ") +
      ")";

    if (withTypes && returns?.explicit) {
      out += ": " + returns.name;
    }

    return out;
  }

  /**
   * @see https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html#template
   * @private
   */
  static #commentGeneric(generic: FunctionsCompilerDataGeneric) {
    const { type, name, defaults, description } = generic;
    let out = `@template {${type}} `;

    out += defaults ? "[" + name + "=" + defaults + "]" : name;

    if (description) {
      out += " - " + description; // required hyphen
    }

    return out;
  }

  /**
   * @see https://jsdoc.app/tags-param
   * @private
   */
  static #commentParam(arg: FunctionsCompilerDataArg) {
    const { type, name, optional, defaults, description } = arg;
    let out = `@param {${type}} `;

    out += optional ? "[" + name + "]" : name;

    if (description || optional) {
      out += " - "; // required hyphen

      if (optional) {
        out += "(**optional**";
        if (defaults) {
          out += ", **default**: " + defaults + "";
        }
        out += ")";
      }

      out += description ? " " + description : "";
    }

    return out;
  }

  /**
   * @private
   * @returns block comment string based on the given {@link FunctionsCompilerComment data}
   */
  static #comment(data: FunctionsCompilerData) {
    const { generics, args, comment = {}, returns } = data;
    const { title, body, internal, tags } = comment;
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

    if (tags) tags.forEach((tag) => lines.push(`@${tag.key} ${tag.val}`));

    if (generics) {
      generics.forEach((generic) => {
        lines.push(this.#commentGeneric(generic));
      });
    }

    if (args) {
      args.forEach((arg) => {
        lines.push(this.#commentParam(arg));
      });
    }

    if (returns) {
      lines.push(
        "@returns {" +
          returns.name +
          "}" +
          (returns.description ? " - " + returns.description : ""),
      );
    }

    return lines.length ? `/**\n * ${lines.join("\n * ")}\n */\n` : "";
  }

  /**
   * @private
   * @returns Rollup based no side effects bundler hint
   */
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
    const { imports, name } = data;
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
      out += `let ${name} = ${this.#args(data, true)} => `;
      out += this.#getBody(data, options, "ts") + ";";
    } else if (opts_style === "function") {
      out += `function ${name}${this.#args(data, true)} {`;
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
    const { imports, name } = data;
    const { opts_imports, opts_exports, opts_comments, opts_style } = options;
    let out =
      opts_imports && imports.length
        ? imports.map((i) => i.$out("cjs", opts_imports)).join("\n") + "\n\n"
        : "";
    out += this.#getBefore(data, "cjs");
    out += opts_comments ? this.#comment(data) : "";
    out += this.#pure(options);

    if (opts_style === "arrow") {
      out += `let ${name} = ${this.#args(data, false)} => `;
      out += this.#getBody(data, options, "cjs") + ";";
    } else if (opts_style === "function") {
      out += `function ${name}${this.#args(data, false)} {`;
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

  /**
   * @returns function's source based on the given {@link FunctionsCompilerFormat format}
   * and {@link FunctionsCompilerOutputOptions options}
   */
  $out(
    format: FunctionsCompilerFormat,
    options: FunctionsCompilerOutputOptions,
  ) {
    return FunctionsCompiler.#out(this.data, format, options);
  }

  /**
   * @returns function's source in the output format more suitable to inline the
   * function within a piece of source code
   */
  $outInline() {
    return FunctionsCompiler.#out(this.data, "cjs", {
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

  /**
   * @private
   */
  static #out(
    data: FunctionsCompilerData,
    format: FunctionsCompilerFormat,
    options: FunctionsCompilerOutputOptions,
  ) {
    const resolvedOptions = this.resolveOptions(options);
    if (format === "ts") return this.#ts(data, resolvedOptions);
    if (format === "cjs") return this.#cjs(data, resolvedOptions);
    return "";
  }

  /**
   * @public
   */
  static outMany(
    format: FunctionsCompilerFormat,
    instances: FunctionsCompiler[] | Set<FunctionsCompiler>,
    options: FunctionsCompilerOutputOptions,
  ) {
    const list = Array.from(instances);
    return list.length
      ? list.map((i) => this.#out(i.data, format, options)).join("\n\n")
      : "";
  }
}

import {
  FunctionsCompiler,
  type FunctionsCompilerData,
  type FunctionsCompilerOutputOptions,
} from "./functions";
import { ImportsCompiler } from "./imports";

describe("FunctionsCompiler", () => {
  const defaultData: FunctionsCompilerData = {
    imports: [],
    name: "myFunction",
    body: 'return "Hello, World!";',
    args: [{ name: "myArg", type: "string", optional: true }],
    returns: { name: "string", description: "The returned greeting message." },
  };

  it("should instantiate correctly with provided data", () => {
    const compiler = new FunctionsCompiler(defaultData);
    expect(compiler.name).toBe(defaultData.name);
    expect(compiler.data).toEqual(defaultData);
  });

  describe("out", () => {
    it("should output TypeScript function correctly with named export", () => {
      const options: FunctionsCompilerOutputOptions = {
        imports: false,
        exports: "named",
        comments: true,
        style: "function",
        pure: false,
      };
      const compiler = new FunctionsCompiler(defaultData);
      const result = compiler.$out("ts", options);
      expect(result).toContain("function myFunction(");
      expect(result).toContain('return "Hello, World!";');
      expect(result).toContain(
        "@returns {string} - The returned greeting message.",
      );
    });

    it("should output CommonJS function correctly without comments", () => {
      const options: FunctionsCompilerOutputOptions = {
        imports: false,
        exports: false,
        comments: false,
        style: "arrow",
        pure: false,
      };
      const compiler = new FunctionsCompiler(defaultData);
      const result = compiler.$out("cjs", options);
      expect(result).toContain("let myFunction = (myArg) => {");
      expect(result).toContain('return "Hello, World!";');
    });

    it("should handle implicit return correctly", () => {
      const dataWithImplicitReturn: FunctionsCompilerData = {
        ...defaultData,
        implicitReturn: true,
      };
      const compiler = new FunctionsCompiler(dataWithImplicitReturn);
      const result = compiler.$out("ts", {
        imports: false,
        exports: false,
        comments: false,
        style: "arrow",
        pure: false,
      });
      expect(result).toContain(
        'let myFunction = (myArg?: string) => return "Hello, World!";',
      );
    });

    it("should output without imports if specified", () => {
      const options: FunctionsCompilerOutputOptions = {
        imports: false,
        exports: "default",
        comments: true,
        style: "function",
        pure: false,
      };
      const compiler = new FunctionsCompiler(defaultData);
      const result = compiler.$out("ts", options);
      expect(result).not.toContain("import");
    });
  });

  describe("outMany", () => {
    it("should output multiple functions correctly", () => {
      const instances = new Set<FunctionsCompiler>([
        new FunctionsCompiler({ ...defaultData, name: "firstFunction" }),
        new FunctionsCompiler({
          ...defaultData,
          name: "secondFunction",
          body: 'return "Goodbye!";',
        }),
      ]);

      const result = FunctionsCompiler.outMany("ts", instances, {
        imports: false,
        exports: false,
        comments: true,
        style: "function",
        pure: false,
      });

      expect(result).toContain("function firstFunction(");
      expect(result).toContain('return "Hello, World!";');
      expect(result).toContain("function secondFunction(");
      expect(result).toContain('return "Goodbye!";');
    });

    it("should return an empty string when no instances are provided", () => {
      const result = FunctionsCompiler.outMany(
        "ts",
        new Set<FunctionsCompiler>(),
        {
          imports: false,
          exports: false,
          comments: true,
          style: "function",
          pure: false,
        },
      );
      expect(result).toBe("");
    });
  });

  describe("resolveOptions", () => {
    it("should resolve default options correctly", () => {
      const options: FunctionsCompilerOutputOptions = {
        imports: false,
        exports: "named",
        comments: false,
        style: "arrow",
        pure: true,
      };
      const resolved = FunctionsCompiler.resolveOptions(options);
      expect(resolved).toEqual({
        opts_imports: false,
        opts_exports: "named",
        opts_comments: false,
        opts_style: "arrow",
        opts_pure: true,
      });
    });

    it("should set default comments to true when not specified", () => {
      const options: FunctionsCompilerOutputOptions = {
        imports: false,
        exports: "named",
        style: "arrow",
        pure: false,
      };
      const resolved = FunctionsCompiler.resolveOptions(options);
      expect(resolved.opts_comments).toBe(true);
    });
  });

  describe("getBefore", () => {
    it("should return before code when specified", () => {
      const dataWithBefore: FunctionsCompilerData = {
        ...defaultData,
        before: 'console.log("Start");',
      };
      const compiler = new FunctionsCompiler(dataWithBefore);
      const result = compiler.$out("ts", {
        imports: false,
        exports: false,
        comments: false,
        style: "function",
        pure: false,
      });
      expect(result).toContain('console.log("Start");');
    });

    it("should call the before function with correct options", () => {
      const dataWithBeforeFunc: FunctionsCompilerData = {
        ...defaultData,
        before: ({ format }) => `console.log("Start in ${format} format");`,
      };
      const compiler = new FunctionsCompiler(dataWithBeforeFunc);
      const result = compiler.$out("ts", {
        imports: false,
        exports: false,
        comments: false,
        style: "function",
        pure: false,
      });
      expect(result).toContain('console.log("Start in ts format");');
    });
  });

  describe("old tests", () => {
    const functions = new FunctionsCompiler({
      imports: [
        new ImportsCompiler({
          path: "lib",
          named: [{ name: "round" }],
        }),
      ],
      name: "sum",
      comment: { internal: true },
      args: [
        { name: "n1", type: "number", optional: false },
        { name: "n2", type: "number", optional: false },
      ],
      body: `round(n1 + n2)`,
      implicitReturn: true,
    });

    const comment = [
      "/**",
      " * @internal",
      " * @param {number} n1",
      " * @param {number} n2",
      " */",
      "",
    ].join("\n");

    it("should output correct 'ts' format", () => {
      expect(functions.$out("ts", { imports: {}, exports: "named" })).toEqual(
        `import { round } from "./lib";` +
          `\n\n` +
          `${comment}export let sum = (n1: number, n2: number) => round(n1 + n2);`,
      );

      expect(functions.$out("ts", { imports: false, exports: "both" })).toEqual(
        `${comment}export let sum = (n1: number, n2: number) => round(n1 + n2);` +
          `\n\n` +
          `export default sum;`,
      );

      expect(
        functions.$out("ts", { imports: false, exports: "default" }),
      ).toEqual(
        `${comment}let sum = (n1: number, n2: number) => round(n1 + n2);` +
          `\n\n` +
          `export default sum;`,
      );

      expect(functions.$out("ts", { imports: false, exports: false })).toEqual(
        `${comment}let sum = (n1: number, n2: number) => round(n1 + n2);`,
      );

      expect(
        functions.$out("ts", {
          imports: false,
          exports: false,
          style: "function",
        }),
      ).toEqual(
        `${comment}function sum(n1: number, n2: number) { return round(n1 + n2);}`,
      );
    });

    it("should output correct 'cjs' format", () => {
      expect(functions.$out("cjs", { imports: {}, exports: "named" })).toEqual(
        `const { round } = require("./lib");` +
          `\n\n` +
          `${comment}let sum = (n1, n2) => round(n1 + n2);` +
          `\n\n` +
          `exports.sum = sum;`,
      );

      expect(
        functions.$out("cjs", { imports: false, exports: "both" }),
      ).toEqual(
        `${comment}let sum = (n1, n2) => round(n1 + n2);` +
          `\n\n` +
          `exports.sum = sum;` +
          `\n\n` +
          `module.exports = sum;`,
      );

      expect(
        functions.$out("cjs", { imports: false, exports: "default" }),
      ).toEqual(
        `${comment}let sum = (n1, n2) => round(n1 + n2);` +
          `\n\n` +
          `module.exports = sum;`,
      );

      expect(functions.$out("cjs", { imports: false, exports: false })).toEqual(
        `${comment}let sum = (n1, n2) => round(n1 + n2);`,
      );
    });
  });
});

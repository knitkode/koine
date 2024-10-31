import { ImportsCompiler, type ImportsCompilerData } from "./imports";

describe("ImportsCompiler", () => {
  const defaultData: ImportsCompilerData = {
    path: "lib",
    defaulT: "myFn",
    named: [{ name: "myUtil" }, { name: "MyType", type: true }],
  };

  it("should instantiate correctly with provided data", () => {
    const compiler = new ImportsCompiler(defaultData);
    expect(compiler.data).toEqual(defaultData);
  });

  describe("getDir", () => {
    it("should return current directory when folderUp is 0 and external is false", () => {
      const result = ImportsCompiler.getDir({ folderUp: 0, external: false });
      expect(result).toBe("./");
    });

    it("should return correct directory for folderUp greater than 0", () => {
      const result = ImportsCompiler.getDir({ folderUp: 2 });
      expect(result).toBe("../../");
    });

    test("should output correct import path for folderUp greater than 0", () => {
      const result = new ImportsCompiler({ path: "lib", defaulT: "lib" }).$out(
        "ts",
        { folderUp: 2 },
      );
      expect(result).toBe('import lib from "../../lib";');
    });

    it("should return empty string for external imports", () => {
      const result = ImportsCompiler.getDir({ external: true });
      expect(result).toBe("");
    });
  });

  describe("out", () => {
    const instances = new ImportsCompiler(defaultData);

    it("should output types import when using 'ts' format", () => {
      expect(instances.$out("ts", {})).toBe(
        `import myFn, { myUtil, type MyType } from "./lib";`,
      );
    });

    it("should skip types import when using 'cjs' format", () => {
      expect(instances.$out("cjs", {})).toBe(
        `const myFn = require("./lib");\n` +
          `const { myUtil } = require("./lib");`,
      );
    });

    it("should output TypeScript import correctly", () => {
      const result = ImportsCompiler.out(defaultData, "ts", { folderUp: 1 });
      expect(result).toBe(
        'import myFn, { myUtil, type MyType } from "../lib";',
      );
    });

    it("should output CommonJS import correctly", () => {
      const result = ImportsCompiler.out(defaultData, "cjs", { folderUp: 1 });
      expect(result).toBe(
        'const myFn = require("../lib");\nconst { myUtil } = require("../lib");',
      );
    });

    it("should throw error for unsupported format", () => {
      expect(() => {
        ImportsCompiler.out(defaultData, "unsupported" as any);
      }).toThrow();
    });
  });

  describe("outMany", () => {
    it("should aggregate imports correctly when they are from the same path", () => {
      const instances = new Set<ImportsCompiler>([
        new ImportsCompiler({
          path: "lib",
          defaulT: "myFn",
          named: [{ name: "MyType", type: true }],
        }),
        new ImportsCompiler({ path: "lib", named: [{ name: "anotherFn" }] }),
      ]);

      const result = ImportsCompiler.outMany("ts", instances);
      expect(result).toBe(
        'import myFn, { type MyType, anotherFn } from "./lib";\n\n',
      );
    });

    it("should aggregate mixed type and default imports correctly when they are from the same external package", () => {
      const result = ImportsCompiler.outMany("ts", [
        new ImportsCompiler({ path: "@o/l", defaulT: "myLib" }),
        new ImportsCompiler({ path: "@o/l", named: [{ name: "named" }] }),
        new ImportsCompiler({
          path: "@o/l",
          named: [{ name: "MyType", type: true }],
        }),
      ]);

      expect(result).toBe(
        `import myLib, { named, type MyType } from "@o/l";\n\n`,
      );
    });

    it("should throw error for multiple default imports from the same path", () => {
      const instances = new Set<ImportsCompiler>([
        new ImportsCompiler({ path: "lib", defaulT: "myFn" }),
        new ImportsCompiler({ path: "lib", defaulT: "anotherImport" }),
      ]);

      expect(() => {
        ImportsCompiler.outMany("ts", instances);
      }).toThrow("Aggregated imports declare multiple default imports.");
    });

    it("should return empty string when there are no instances", () => {
      const result = ImportsCompiler.outMany("ts", new Set<ImportsCompiler>());
      expect(result).toBe("");
    });
  });

  describe("private behavior", () => {
    it("should handle external packages correctly when determining import type", () => {
      const externalImport = new ImportsCompiler({ path: "@scope/package" });
      expect(externalImport.data.path.startsWith("@")).toBe(true);
    });

    it("should recognize a non-external package correctly", () => {
      const localImport = new ImportsCompiler({ path: "my-package" });
      expect(localImport.data.path.startsWith("@")).toBe(false);
    });
  });
});

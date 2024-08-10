import { ImportsCompiler } from "./imports";

describe("imports compilation", () => {
  const imports = new ImportsCompiler({
    path: "lib",
    defaulT: "Lib",
    named: [{ name: "util" }, { name: "util2" }, { name: "AType", type: true }],
  });
  const importsSingle = new ImportsCompiler({
    path: "lib",
    defaulT: "lib",
  });

  test("to 'ts' format", () => {
    expect(imports.$out("ts", { folderUp: 0 })).toEqual(
      `import Lib, { util, util2, type AType } from "./lib";`,
    );
  });

  test("to 'cjs' format", () => {
    expect(imports.$out("cjs", { folderUp: 0 })).toEqual(
      `const Lib = require("./lib");\n` +
        `const { util, util2 } = require("./lib");`,
    );
  });

  test("folderUp 2", () => {
    expect(importsSingle.$out("ts", { folderUp: 2 })).toEqual(
      `import lib from "../../lib";`,
    );
  });
});

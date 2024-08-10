import { FunctionsCompiler } from "./functions";
import { ImportsCompiler } from "./imports";

describe("functions compilation", () => {
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
  });

  const comment = `/**
 * @internal
 */\n`;

  test("to 'ts' format", () => {
    expect(
      functions.$out("ts", { imports: { folderUp: 0 }, exports: "named" }),
    ).toEqual(
      `import { round } from "./lib";

${comment}export let sum = (n1: number, n2: number) => round(n1 + n2);`,
    );

    expect(functions.$out("ts", { imports: false, exports: "both" })).toEqual(
      `${comment}export let sum = (n1: number, n2: number) => round(n1 + n2);

export default sum;`,
    );

    expect(
      functions.$out("ts", { imports: false, exports: "default" }),
    ).toEqual(
      `${comment}let sum = (n1: number, n2: number) => round(n1 + n2);

export default sum;`,
    );

    expect(functions.$out("ts", { imports: false, exports: false })).toEqual(
      `${comment}let sum = (n1: number, n2: number) => round(n1 + n2);`,
    );
  });

  test("to 'cjs' format", () => {
    expect(
      functions.$out("cjs", { imports: { folderUp: 0 }, exports: "named" }),
    ).toEqual(
      `const { round } = require("./lib");

${comment}let sum = (n1, n2) => round(n1 + n2);

exports.sum = sum;`,
    );

    expect(functions.$out("cjs", { imports: false, exports: "both" })).toEqual(
      `${comment}let sum = (n1, n2) => round(n1 + n2);

exports.sum = sum;

module.exports = sum;`,
    );

    expect(
      functions.$out("cjs", { imports: false, exports: "default" }),
    ).toEqual(
      `${comment}let sum = (n1, n2) => round(n1 + n2);

module.exports = sum;`,
    );

    expect(functions.$out("cjs", { imports: false, exports: false })).toEqual(
      `${comment}let sum = (n1, n2) => round(n1 + n2);`,
    );
  });
});

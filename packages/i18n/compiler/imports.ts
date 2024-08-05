import { getImportDots } from "./helpers";

export type ImportsCompilerData = {
  /**
   * `myPath` in `import type { MyType } from "../myPath"`;
   */
  path: string;
  /**
   * `myImport` in `import myImport from "../myPath"`;
   *  or in `import myImport, { myNamed } from "../myPath"`;
   */
  defaulT?: string;
  /**
   * `myPath` in `import type { MyType } from "../myPath"`;
   */
  named?: ImportsCompilerDataNamed[];
};

type ImportsCompilerDataNamed = {
  /**
   * `MyType` in `import type { MyType } from "../myPath"`;
   */
  name: string;
  /**
   * Determines `type ` in `import type { MyType } from "../myPath"`;
   */
  type?: boolean;
};

export type ImportsCompilerOutputOptions = {
  /**
   * Determines the `../` in `import type { MyType } from "../myPath"`;
   */
  folderUp: number;
};

export class ImportsCompiler {
  data: ImportsCompilerData;

  constructor(data: ImportsCompilerData) {
    this.data = data;
  }

  static #ts(data: ImportsCompilerData, options: ImportsCompilerOutputOptions) {
    const { path, defaulT, named = [] } = data;
    const { folderUp } = options;
    const dir = getImportDots(folderUp);
    let out = `import `;
    if (defaulT) {
      out += defaulT;
      if (named.length) out += ", ";
    }
    if (named.length) {
      out +=
        "{ " +
        named
          .map(({ name, type }) => (type ? "type " + name : name))
          .join(", ") +
        " }";
    }

    out += ' from "' + dir + path + '";';

    return out;
  }

  $out(format: "ts", options: ImportsCompilerOutputOptions) {
    if (format === "ts") return ImportsCompiler.#ts(this.data, options);
    return "";
  }

  static out(
    data: ImportsCompilerData,
    format: "ts",
    options: ImportsCompilerOutputOptions,
  ) {
    if (format === "ts") return this.#ts(data, options);
    return "";
  }

  static outMany(
    format: "ts",
    instances: ImportsCompiler[] | Set<ImportsCompiler>,
    options: ImportsCompilerOutputOptions,
  ) {
    const list = Array.from(instances);
    return list.length
      ? list.map((i) => this.out(i.data, format, options)).join("\n") + "\n\n"
      : "";
  }
}

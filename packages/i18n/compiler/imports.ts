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

type ImportsCompilerOutputFormat = "ts" | "cjs";

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

  static #cjs(
    data: ImportsCompilerData,
    options: ImportsCompilerOutputOptions,
  ) {
    const { path, defaulT, named = [] } = data;
    const { folderUp } = options;
    const dir = getImportDots(folderUp);
    const partRequire = `= require("${dir + path}")`;
    let out = "";

    if (defaulT) {
      out += `const ${defaulT} ${partRequire};`;
    }
    if (named.length) {
      if (defaulT) out += "\n";

      // prettier-ignore
      out += `const { ${named.filter((e) => !e.type).map((e) => e.name).join(", ")} } ${partRequire};`;
    }

    return out;
  }

  $out(
    format: ImportsCompilerOutputFormat,
    options: ImportsCompilerOutputOptions,
  ) {
    return ImportsCompiler.out(this.data, format, options);
  }

  static out(
    data: ImportsCompilerData,
    format: ImportsCompilerOutputFormat,
    options: ImportsCompilerOutputOptions,
  ) {
    if (format === "ts") return this.#ts(data, options);
    if (format === "cjs") return this.#cjs(data, options);
    return "";
  }

  static outMany(
    format: ImportsCompilerOutputFormat,
    instances: ImportsCompiler[] | Set<ImportsCompiler>,
    options: ImportsCompilerOutputOptions,
  ) {
    const list = Array.from(instances);
    return list.length
      ? list.map((i) => this.out(i.data, format, options)).join("\n") + "\n\n"
      : "";
  }
}

export type ImportsCompilerData = {
  /**
   * `myPath` in `import type { MyType } from "../myPath"`;
   */
  path: string;
  /**
   * Flags an import from a thirdy part package. This is not needed when the path
   * begins with a `@`, in the other cases we cannot infer this information.
   */
  external?: boolean;
  /**
   * `myImport` in `import myImport from "../myPath"`;
   *  or in `import myImport, { myNamed } from "../myPath"`;
   */
  defaulT?: string;
  /**
   * `myPath` in `import type { MyType } from "../myPath"`;
   */
  named?: ImportsCompilerDataNamed[];
  // fn: false | FunctionsCompiler;
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
  folderUp?: number;
};

type ImportsCompilerOutputFormat = "ts" | "cjs";

// export let getImportDots = (folderUp = 0) =>
//   (folderUp ? Array(folderUp).fill("..").join("/") : ".") + "/";

export class ImportsCompiler {
  data: ImportsCompilerData;

  constructor(data: ImportsCompilerData) {
    this.data = data;
  }

  static #aggregateImports(list: ImportsCompiler[]) {
    const mapByPath = list.reduce((map, instance) => {
      const { path } = instance.data;
      map[path] = map[path] || [];
      map[path].push(instance);
      return map;
    }, {} as Record<string, ImportsCompiler[]>);

    return Object.keys(mapByPath).map(path => {
      const instances = mapByPath[path];

      if (instances.length > 1) {
        let finalNamed: ImportsCompilerDataNamed[] = [];
        let finalDefaulT: string = "";

        instances.forEach(instance => {
          const { defaulT, named } = instance.data;
          if (named) {
            finalNamed = [...finalNamed, ...named];
          }
          if (defaulT) {
            if (finalDefaulT) {
              throw Error(
                `ImportsCompiler: Aggregated imports declare multiple default imports. ` +
                `Default import "${defaulT}" conflicts with "${finalDefaulT}"`
              );
            } else {
              finalDefaulT = defaulT;
            }
          }
        });

        return new ImportsCompiler({
          defaulT: finalDefaulT,
          named: finalNamed,
          path
        });
      }

      return instances[0];
    })
  }

  public static getDir(options: { folderUp?: number; external?: boolean; }) {
    const { folderUp = 0, external } = options;

    if (external) return "";

    return (folderUp ? Array(folderUp).fill("..").join("/") : ".") + "/";
  }

  static #isExternal(data: ImportsCompilerData) {
    const { path, external } = data;
    
    if (typeof external === "boolean") return external;

    return path.startsWith("@");
  }

  static #ts(data: ImportsCompilerData, options?: ImportsCompilerOutputOptions) {
    const { path, defaulT, named = [] } = data;
    const { folderUp } = options || {};
    const dir = this.getDir({ folderUp, external: this.#isExternal(data) });
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
    options?: ImportsCompilerOutputOptions,
  ) {
    const { path, defaulT, named = [] } = data;
    const { folderUp } = options || {};
    const dir = this.getDir({ folderUp, external: this.#isExternal(data) });
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
    options?: ImportsCompilerOutputOptions,
  ) {
    return ImportsCompiler.out(this.data, format, options);
  }

  static out(
    data: ImportsCompilerData,
    format: ImportsCompilerOutputFormat,
    options?: ImportsCompilerOutputOptions,
  ) {
    if (format === "ts") return this.#ts(data, options);
    if (format === "cjs") return this.#cjs(data, options);
    throw Error(`ImportsCompiler: Unsupported format '${format}'`);
    return "";
  }

  static outMany(
    format: ImportsCompilerOutputFormat,
    instances: ImportsCompiler[] | Set<ImportsCompiler>,
    options?: ImportsCompilerOutputOptions,
  ) {
    const list = this.#aggregateImports(Array.from(instances));

    return list.length
      ? list.map((i) => this.out(i.data, format, options)).join("\n") + "\n\n"
      : "";
  }
}

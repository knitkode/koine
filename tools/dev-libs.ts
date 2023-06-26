/**
 * @file
 *
 * This script automatically adds all the required `exports` to libs `package.json`s
 * in order to make deep imports work within node resolution.
 */
import { readFile, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import type {
  AmdConfig,
  CommonJsConfig,
  Es6Config,
  NodeNextConfig,
  UmdConfig,
  Config as _SWCConfig,
} from "@swc/core";
import chalk from "chalk";
import { Command } from "commander";
import json from "comment-json";
import { glob } from "glob";
import ora from "ora";
import { PackageJson, TsConfigJson } from "type-fest";
import { oraOpts } from "./dev.js";
import { type Lib as LibBase, self } from "./helpers.js";

const libsConfig: LibConfig[] = [
  { name: "browser", type: "module", exports: ["esm", "cjs"], minify: true },
  { name: "dom", type: "module", exports: ["esm", "cjs"], minify: true },
  { name: "utils", type: "module", exports: ["esm", "cjs"], minify: true },
];

// FIXME: to fix in swc? just exclude `SystemjsConfig` because it does not extends `BaseModuleConfig`
type SWCConfig = Omit<_SWCConfig, "module"> & {
  module: Es6Config | NodeNextConfig | CommonJsConfig | UmdConfig | AmdConfig;
};

export const libs = () =>
  new Command("libs")
    .description("Manage libs exports/bundling")
    .action(async () => {
      await Promise.all(
        libsConfig.map(mergeLibData).map(async (lib) => {
          const suffixText = chalk.dim(`[${lib.name}]`);
          const spinner = ora({
            suffixText,
            text: `Write exports`,
            ...oraOpts,
          }).start();

          await writeLibExports(lib);

          spinner.succeed();

          const spinner2 = ora({
            suffixText,
            text: `Set the lib 'module' type`,
            ...oraOpts,
          }).start();

          await setLibOptions(lib);

          spinner2.succeed();
        })
      );

      console.log();
    });

type LibConfig = {
  name: string;
  type: "module" | "commonjs";
  exports: false | ("esm" | "cjs")[];
  minify?: boolean;
};

type Lib = LibBase & LibConfig;

function getLibExport(lib: Lib, name?: string, path?: string) {
  name = name ? `./${name}` : ".";
  const exportPath = path ? path : "./index.js";
  const obj: { import?: string; require?: string } = {};

  if (lib.exports) {
    if (lib.exports.includes("cjs")) {
      obj.require = exportPath;
    }

    if (lib.exports.includes("esm")) {
      obj.import = exportPath;
    }
  }

  return { name, obj };
}

async function writeLibExports(lib: Lib) {
  if (!lib.exports) {
    await editJSONfile(lib, "package.json", (data) => {
      delete data.exports;
    });

    return;
  }

  // FIXME: once we have fully migrated to ts we can remove "js"
  const paths = await glob(lib.src + "/**/*.{js,ts,scss}", {
    ignore: [
      // ignore executables
      lib.src + "/bin/*.ts",
      // root index is already exported by `exports: { ".": { import: "./index.js" } }`
      lib.src + "/index.ts",
      // avoid to export configuration files!
      lib.src + "/jest.config.ts",
      // ignore typings
      lib.src + "/*.d.ts",
      // ignore "private" files prefixed with `_` (local convention)
      lib.src + "/_*.ts",
    ],
  });

  const pathsToExports = paths
    .map((fileOrFolderPath) => {
      const dir = relative(lib.src, fileOrFolderPath);
      return dir;
    })
    .sort();

  // console.log(`${lib.name}:`, pathsToExports);

  const defaultExp = getLibExport(lib);
  const exports = pathsToExports.reduce(
    (map, path) => {
      const isScssFile = path.endsWith(".scss");
      // FIXME: once we have fully migrated to ts we can remove "|\.js" in regex
      const name = isScssFile
        ? path
        : path.replace(/\.ts|\.js$/, "").replace(/\/index$/, "");
      const jsFilePath = `./${path.replace(/.ts$/, ".js")}`;
      const exp = getLibExport(lib, name, jsFilePath);
      map[exp.name] = exp.obj;
      return map;
    },
    {
      [defaultExp.name]: defaultExp.obj,
    } as Record<string, object>
  );

  await editJSONfile(lib, "package.json", (data) => {
    data.exports = exports;
  });
}

function overrideByLibType<T, L extends LibConfig["type"]>(
  option: T,
  libType: L,
  override: Record<L, NonNullable<T>>
) {
  option = override[libType];
}

async function setLibOptions(lib: Lib) {
  await editJSONfile(lib, ".swcrc", (data: SWCConfig) => {
    data.module = data.module || {} as SWCConfig["module"];

    overrideByLibType(data.module.type, lib.type, {
      module: "es6",
      commonjs: "commonjs",
    });
    overrideByLibType(data.module.noInterop, lib.type, {
      module: true,
      commonjs: false,
    });

    // FIXME: this is not yet supported officially?
    // overrideByLibType(data.module.importInterop, lib.type, {
    //   module: "none",
    //   commonjs: "node"
    // });
    delete data.module.importInterop;

    data.minify = !!lib.minify;

    // exclude some `.d.ts` files otherwise they get compield into empty `.d.js`
    // file, if we want to include those files in the publishable build they
    // need to be defined in the `options.assets` of the package's `project.json`
    // particularly we are interested in "./typings.d.ts" and "./globals.d.ts"
    const exclude = Array.isArray(data.exclude)
      ? data.exclude
      : [data.exclude || ""];
    data.exclude = Array.from(new Set([...exclude, "./*\\.d.ts"]));
  });

  await editJSONfile(lib, "tsconfig.json", (data: TsConfigJson) => {
    data.compilerOptions = data.compilerOptions || {};
    overrideByLibType(data.compilerOptions.module, lib.type, {
      module: "ESNext",
      commonjs: "CommonJS",
    });
  });

  await editJSONfile(lib, "package.json", (data: PackageJson) => {
    if (lib.type === "commonjs") {
      delete data.type;
    } else {
      data.type = lib.type;
    }
  });
}

async function editJSONfile(
  lib: Lib,
  fileName: string,
  transformer: (data: any) => void
) {
  const filePath = join(lib.src, fileName);

  try {
    const fileContent = await readFile(filePath, { encoding: "utf-8" });
    // let fileJSON = JSON.parse(fileContent);
    let fileJSON = json.parse(fileContent);
    transformer(fileJSON);
    // const newContent = JSON.stringify(fileJSON, null, 2);
    const newContent = json.stringify(fileJSON, null, 2);

    if (newContent) {
      await writeFile(filePath, newContent);
    }
  } catch (err) {
    console.log("🚀 ~ file: libs-exports.ts:157:", filePath);
    // throw e;
    return;
  }
}

function mergeLibData(lib: LibConfig): Lib {
  const libBase = self.libsMap[`${self.scope}/${lib.name}`];
  if (libBase) {
    return { ...libBase, ...lib };
  }
  throw Error(`Trying to process unexisting lib "${lib.name}"`);
}

/**
 * @file
 *
 * This script automatically adds all the required `exports` to libs `package.json`s
 * in order to make deep imports work within node resolution.
 */
import { relative } from "node:path";
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
import { glob } from "glob";
import ora from "ora";
import { PackageJson, TsConfigJson } from "type-fest";
import { oraOpts } from "./dev.js";
import { type Lib as LibBase, editJSONfile, self } from "./helpers.js";

const libsConfig: LibConfig[] = [
  { name: "api", type: "module", exports: ["esm"], minify: false },
  { name: "browser", type: "module", exports: ["esm"], minify: false },
  { name: "dom", type: "module", exports: ["esm"], minify: false },
  { name: "react", type: "module", exports: ["esm"], minify: false },
  { name: "next", type: "module", exports: ["esm"], minify: false },
  { name: "utils", type: "module", exports: ["esm"], minify: false },
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
  /**
   * Set to explicit `"none"` to delete the key/value if found
   */
  type?: "none" | "module" | "commonjs";
  /**
   * Set to explicit `"none"` to delete the key/value if found
   */
  exports?: "none" | ("esm" | "cjs")[];
  minify?: boolean;
};

type Lib = LibBase & LibConfig;

function getLibExport(lib: Lib, name?: string, path?: string) {
  name = name ? `./${name}` : ".";
  const exportPath = path ? path : "./index.js";
  const obj: { import?: string; require?: string /* ; types: string; */ } = {
    // types: exportPath.replace(/\.js$/, ".d.ts")
  };

  if (lib.exports) {
    if (lib.exports.includes("cjs")) {
      obj.require = exportPath;
    }

    if (lib.exports.includes("esm")) {
      obj.import = lib.exports.includes("cjs")
        ? exportPath.replace(/\.js$/, ".mjs")
        : exportPath;
    }
  }

  return { name, obj };
}

async function writeLibExports(lib: Lib) {
  if (typeof lib.exports === "undefined") {
    return;
  }

  if (lib.exports === "none") {
    await editJSONfile([lib.dist, lib.src], "package.json", (data) => {
      delete data.exports;
    });

    return;
  }

  // FIXME: once we have fully migrated to ts we can remove "js"
  const paths = await glob(lib.src + "/**/*.{js,ts,tsx,scss}", {
    ignore: [
      // ignore executables
      lib.src + "/bin/*.ts",
      // root index is already exported by `exports: { ".": { import: "./index.js" } }`
      lib.src + "/index.ts",
      // avoid to export configuration files!
      // lib.src + "/jest.config.{js,ts}",
      // lib.src + "/postcss.config.{js.ts}",
      // lib.src + "/tailwind.config.{js.ts}",
      lib.src + "/*.config.{js,ts}",
      // ignore typings
      lib.src + "/*.d.ts",
      // ignore "private" files prefixed with `_` (local convention)
      lib.src + "/_*.ts",
      // ignore tests
      lib.src + "/*.{spec,test}.{js,ts,tsx}",
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
        : path.replace(/\.tsx|\.ts|\.js$/, "").replace(/\/index$/, "");
      const jsFilePath = `./${path.replace(/\.tsx|\.ts$/, ".js")}`;
      const exp = getLibExport(lib, name, jsFilePath);
      map[exp.name] = exp.obj;

      // EXP: trying to export both names with and without .js extension
      // probably not needed? doing it while fighting with nextjs build
      // if (!isScssFile && name) {
      //   const expWithJs = getLibExport(lib, name + ".js", jsFilePath);
      //   map[expWithJs.name] = exp.obj;
      // }

      return map;
    },
    {
      [defaultExp.name]: defaultExp.obj,
    } as Record<string, object>
  );

  await editJSONfile([lib.dist, lib.src], "package.json", (data) => {
    data.exports = exports;
  });
}

function overrideByLibType<T, L extends NonNullable<LibConfig["type"]>>(
  option: T,
  libType: L,
  override: Record<L, NonNullable<T>>
) {
  option = override[libType];
  return override[libType];
}

async function setLibOptions(lib: Lib) {
  await editJSONfile(lib.src, ".swcrc", (data: SWCConfig) => {
    data.module = data.module || ({} as SWCConfig["module"]);

    if (lib.type !== "none") {
      data.module.type = overrideByLibType(data.module.type, lib.type, {
        module: "es6",
        commonjs: "commonjs",
      });
      
      data.module.noInterop = overrideByLibType(data.module.noInterop, lib.type, {
        module: true,
        commonjs: false,
      });

      // FIXME: this is not yet supported officially?
      // overrideByLibType(data.module.importInterop, lib.type, {
      //   module: "none",
      //   commonjs: "node"
      // });
      delete data.module.importInterop;
    }

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

  await editJSONfile(lib.src, "tsconfig.json", (data: TsConfigJson) => {
    if (lib.type && lib.type !== "none") {
      data.compilerOptions = data.compilerOptions || {};
      data.compilerOptions.module = overrideByLibType(data.compilerOptions.module, lib.type, {
        module: "ESNext",
        commonjs: "CommonJS",
      });
    }
  });

  await editJSONfile(
    [lib.src, lib.dist],
    "package.json",
    (data: PackageJson) => {
      if (lib.type === "none") {
        delete data.type;
      } else if (lib.type === "commonjs") {
        delete data.type;
      } else {
        data.type = lib.type;
      }
    }
  );
}

function mergeLibData(lib: LibConfig): Lib {
  const libBase = self.libsMap[`${self.scope}/${lib.name}`];
  if (libBase) {
    return { ...libBase, ...lib };
  }
  throw Error(`Trying to process unexisting lib "${lib.name}"`);
}

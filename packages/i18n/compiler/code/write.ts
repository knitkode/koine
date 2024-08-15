import {
  existsSync,
  readFileSync, // renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { rm } from "node:fs/promises";
import { EOL } from "node:os";
import { dirname, join, relative, sep } from "node:path";
import { parse, stringify } from "comment-json";
import * as ts from "typescript";
import type { RequiredDeep, SetRequired } from "@koine/utils";
import type { TsConfigJson } from "@koine/utils";
import { fsWrite, fsWriteSync } from "@koine/node";
import { getTranslationsDir } from "../helpers";
import type { I18nCompiler } from "../types";
import {
  type CodeGenerateReturn,
  generateCode,
  generateCodeSync,
} from "./generate";
import { tsCompile } from "./tsCompile";

/**
 * Options for _code_ writing
 */
export type CodeWriteOptions = {
  /**
   * @default process.cwd()
   */
  cwd?: string;
  /**
   * Relative to the given `cwd`.
   *
   * Use a _dot_ named folder in order to be automatically ignored when your
   * i18n input source files live in the same folder as the generated code
   */
  output: string;
  /**
   * @default true
   */
  emptyOutputFolder?: boolean;
  /**
   * Determines how .gitignore files are managed
   *
   * - `"all"`: it generates a simple .gitignore file that ignores everything
   * within the `output` folder except itself
   * - `"granular"`: it generates a .gitignore file with all the paths of the
   * generated source code files. This can cause zombie files between `@koine/i18n`
   * updates or between multiple code generations as one file might be created
   * on one run and not on the other. The .gitignore file wil lin fact be
   * overwritten each time a code generation happens. This allows you to have
   * custom filesnot gitignored alongside the automatically generated, and
   * therefore gitignored, ones.
   * - `false`: it will not generate any gitignore file
   *
   * @default "all"
   */
  gitignore?: "all" | "granular" | false;
  /**
   * Determine how to treat the `tsconfig` JSON file.
   *
   * Set it to `false` to avoid any file modification.
   *
   * @default { path: "../tsconfg.json", alias: "@/{computed}" }
   */
  tsconfig?:
    | false
    | {
        /**
         * Path of the `tsconfig.json` file relative to the `cwd` option.
         *
         * @default "../tsconfig.json"
         */
        path?: string;
        /**
         * By default `myfolder` is the dynamically resolved leaf folder name of
         * `output` option path' folders tree and append it to the standard `@/`.
         *
         * @default "@/myfolder"
         */
        alias?: string;
      };
  /**
   * TypeScript options. Set this to `true` to compile TypeScript files to
   * JavaScript, .e.g. if you don't already have a compilation step in your project.
   *
   * @default false
   */
  typescriptCompilation?: boolean;
  /**
   * Optionally enable/disable the automatic addition of the `@ts-nocheck` directive
   *
   * @default true Enabled, (NB: `false`: disabled during jest testing)
   */
  tsNoCheck?: boolean;
  /**
   * Optionally enable/disable the automatic addition of the `/* eslint-disable * /` directive
   *
   * @default true Enabled, (NB: `false`: disabled during jest testing)
   */
  eslintDisable?: boolean;
  /**
   * Skip copying the translations files to the `{output}/`{@link getTranslationsDir()}
   * folder
   *
   * @deprecated I guess? Don't we always need those?
   * @default true
   */
  copyTranslations?: boolean;
};

export type CodeWriteOptionsResolved = RequiredDeep<CodeWriteOptions>;

type CodeWriteConfig = CodeWriteOptionsResolved &
  Pick<I18nCompiler.Config, "debug"> & {
    /** It stores the files' paths being written to disk */
    files: Set<string>;
    /** It stores the folders' paths being written to disk */
    folders: Set<string>;
  };

export let writeCode = async <TAdapterName extends I18nCompiler.AdapterName>(
  config: I18nCompiler.Config,
  options: CodeWriteOptionsResolved,
  data: I18nCompiler.DataCode<TAdapterName>,
) => {
  const writeConfig = getWriteCodeConfig(config, options);
  const code = await generateCode(data);

  await emptyOutputFolder(writeConfig);
  await writeCodeFiles(writeConfig, code);
  writeTsconfigFile(writeConfig);
  writeCompiledTypescriptFiles(writeConfig, code);
  await writeTranslationsFiles(writeConfig, data.input);
  writeGitignore(writeConfig);

  return writeConfig;
};

export let writeCodeSync = <TAdapterName extends I18nCompiler.AdapterName>(
  config: I18nCompiler.Config,
  options: CodeWriteOptionsResolved,
  data: I18nCompiler.DataCode<TAdapterName>,
) => {
  const writeConfig = getWriteCodeConfig(config, options);
  const code = generateCodeSync(data);

  emptyOutputFolderSync(writeConfig);
  writeCodeFilesSync(writeConfig, code);
  writeTsconfigFile(writeConfig);
  writeCompiledTypescriptFiles(writeConfig, code);
  writeTranslationsFilesSync(writeConfig, data.input);
  writeGitignore(writeConfig);

  return writeConfig;
};

export function resolveWriteCodeOptions(options: CodeWriteOptions) {
  const {
    cwd = process.cwd(),
    output,
    emptyOutputFolder = true,
    tsconfig = {},
    typescriptCompilation = false,
    tsNoCheck = process.env["JEST_WORKER_ID"] ? false : true,
    eslintDisable = process.env["JEST_WORKER_ID"] ? false : true,
    copyTranslations = true,
    gitignore = "all",
  } = options;
  const resolvedOptions: CodeWriteOptionsResolved = {
    cwd,
    output,
    emptyOutputFolder,
    tsconfig: {
      path: "../tsconfig.json",
      // by default we grab the leaf folder name of output path' folders tree
      alias: `@/${output.split(sep).filter(Boolean).pop() || "i18n"}`,
      ...tsconfig,
    },
    typescriptCompilation,
    tsNoCheck,
    eslintDisable,
    copyTranslations,
    gitignore,
  };

  return resolvedOptions;
}

export function getWriteCodeConfig(
  config: I18nCompiler.Config,
  options: CodeWriteOptionsResolved,
): CodeWriteConfig {
  const files: Set<string> = new Set();
  const folders: Set<string> = new Set();

  return { debug: config.debug, ...options, files, folders };
}

async function emptyOutputFolder(config: CodeWriteConfig) {
  const { cwd, output, emptyOutputFolder } = config;
  if (!emptyOutputFolder) return;
  await rm(join(cwd, output), { force: true, recursive: true });
}

function emptyOutputFolderSync(config: CodeWriteConfig) {
  const { cwd, output, emptyOutputFolder } = config;
  if (!emptyOutputFolder) return;

  rmSync(join(cwd, output), { force: true, recursive: true });
}

function addFileToGitignoreLists(
  config: CodeWriteConfig,
  generatedFile: I18nCompiler.AdapterFileGenerated,
) {
  const { path, dir } = generatedFile;

  if (dir && dir !== ".") {
    config.folders.add(dir);
  } else {
    config.files.add(path);
  }
}

/**
 * NB: this mutates the generated file object
 *
 * Uniformly treat adapter files' generated content, here we:
 *
 * - remove empty first line
 * - add `@ts-nocheck` directive for TypeScript files
 * - add `eslint-disable` directive for JavaScript/TypeScript files
 *
 * @follow [proposal for eslint new directive](https://github.com/eslint/rfcs/pull/118)
 */
const treatFileContent = (
  config: CodeWriteConfig,
  generatedFile: I18nCompiler.AdapterFileGenerated,
) => {
  const { tsNoCheck, eslintDisable } = config;
  const { ext } = generatedFile;
  let { content } = generatedFile;

  // remove empty first/last lines
  content = content.trim();

  if (generatedFile.isBarrel) return;

  if (tsNoCheck && (ext === "d.ts" || ext === "ts" || ext === "tsx")) {
    content = `// @ts-nocheck\n` + content;
  }
  if (
    eslintDisable &&
    (ext === "js" ||
      ext === "mjs" ||
      ext === "d.ts" ||
      ext === "ts" ||
      ext === "tsx")
  ) {
    content = `/* eslint-disable */\n` + content;
  }

  generatedFile.content = content;
  // return content;
};

function manageFileToWrite(
  config: CodeWriteConfig,
  generatedFile: I18nCompiler.AdapterFileGenerated,
) {
  const { path } = generatedFile;
  const filepath = join(config.cwd, config.output, path);
  addFileToGitignoreLists(config, generatedFile);
  treatFileContent(config, generatedFile);

  return filepath;
}

async function writeCodeFiles(
  config: CodeWriteConfig,
  codeGenerated: CodeGenerateReturn,
) {
  return Promise.all(
    codeGenerated.files.map(async (file) => {
      const filepath = manageFileToWrite(config, file);
      await fsWrite(filepath, file.content);
    }),
  );
}

function writeCodeFilesSync(
  config: CodeWriteConfig,
  codeGenerated: CodeGenerateReturn,
) {
  codeGenerated.files.forEach((file) => {
    const filepath = manageFileToWrite(config, file);
    fsWriteSync(filepath, file.content);
  });
}

type TweakedTsConfigFile = Omit<TsConfigJson, "compilerOptions"> & {
  compilerOptions: SetRequired<
    NonNullable<TsConfigJson["compilerOptions"]>,
    "baseUrl" | "paths"
  >;
};

/**
 * The goal is to add something like
 *
 * ```json
 *   "@/i18n": ["libs/i18n/index.ts"],
 *   "@/i18n/*": ["libs/i18n/*"],
 * ```
 * to the given `tsconfig` json file `compilerOptions.paths` in a non-disruptive
 * way (without changing existing content in the same file).
 *
 * @param data NB: We mutate this object
 */
function tweakTsconfigJsonData(config: CodeWriteConfig, data: TsConfigJson) {
  const { cwd, output, tsconfig } = config;
  if (!tsconfig) return;

  const { alias: keyAlias } = tsconfig;
  const keyAliasStar = `${keyAlias}/*`;
  const dirOutput = join(cwd, output);
  const dirTsconfig = dirname(join(cwd, tsconfig.path));
  /** e.g. `libs/i18n` */
  let pathRelativeToTsconfigPath = relative(dirTsconfig, dirOutput);
  // console.log({ dirOutput, dirTsconfig, pathRelativeToTsconfigPath });

  data.compilerOptions = data.compilerOptions || {};
  data.compilerOptions.paths = data.compilerOptions.paths || {};
  if (!data.compilerOptions.baseUrl) {
    /** e.g. `./libs/i18n` */
    pathRelativeToTsconfigPath = `./${pathRelativeToTsconfigPath}`;
  }

  const listAlias = new Set(data.compilerOptions.paths[keyAlias] || []);
  const listAliasStar = new Set(data.compilerOptions.paths[keyAliasStar] || []);
  const valueAlias = pathRelativeToTsconfigPath + "/index.ts";
  const valueAliasStar = pathRelativeToTsconfigPath + "/*";

  if (!listAlias.has(valueAlias) || !listAliasStar.has(valueAliasStar)) {
    listAlias.add(valueAlias);
    listAliasStar.add(valueAliasStar);

    data.compilerOptions.paths[keyAlias] = Array.from(listAlias);
    data.compilerOptions.paths[keyAliasStar] = Array.from(listAliasStar);
    return data as TweakedTsConfigFile;
  }

  return;
}

/**
 */
function writeTsconfigFile(config: CodeWriteConfig) {
  const { cwd, debug, tsconfig } = config;
  if (!tsconfig) return;

  const tsconfigPath = join(cwd, tsconfig.path);
  let hasChanged = false;
  let newData: TweakedTsConfigFile = {
    compilerOptions: {
      baseUrl: ".",
      paths: {},
    },
  };

  if (existsSync(tsconfigPath)) {
    try {
      // ts.findConfigFile(tsconfigPath, ...)
      const content = readFileSync(tsconfigPath, { encoding: "utf-8" });
      const data = parse(content) as TsConfigJson;
      const tweakedData = tweakTsconfigJsonData(config, data);
      if (tweakedData) {
        hasChanged = true;
        newData = tweakedData;
      }
    } catch (_e) {
      console.log(`Failed to read tsconfig at given ${tsconfig.path}`);
      console.log(`a tsconfig.json file will be created at the given path.`);
    }
  } else {
    const tweakedData = tweakTsconfigJsonData(config, newData);
    if (tweakedData) {
      hasChanged = true;
      newData = tweakedData;
    }
  }

  const newContent = stringify(newData, null, 2);

  if (hasChanged) {
    writeFileSync(tsconfigPath, newContent + EOL);
    if (debug || process.env["JEST_WORKER_ID"]) {
      console.log(
        `i18n: tsconfig.json updated. You need to manually check 'paths' are setup correctly.`,
      );
    }
  } else {
    if (debug || process.env["JEST_WORKER_ID"]) {
      console.log(`i18n: tsconfig.json is up to date.`);
    }
  }
}

/**
 * Compiles generated TypeScript source files to JavaScript and `.d.ts` files.
 */
function writeCompiledTypescriptFiles(
  config: CodeWriteConfig,
  codeGenerated: CodeGenerateReturn,
) {
  const { cwd, output, typescriptCompilation } = config;

  if (!typescriptCompilation) return;

  const tsFiles = codeGenerated.files.filter(
    (file) => file.ext === "d.ts" || file.ext === "ts" || file.ext === "tsx",
  );
  const tsFilesPaths = tsFiles.map((file) => file.path);

  // CommonJs output
  tsCompile(cwd, output, tsFilesPaths, {
    module: ts.ModuleKind.CommonJS,
    moduleResolution: ts.ModuleResolutionKind.NodeNext,
  });

  // TODO: check whether we need both esm and commonjs output, commonjs seems
  // needed in order to reuse the same functions outputted through the webpack
  // plugin with the global i18n object

  // // ESM output
  // const emitResult = tsCompile(cwd, output, tsFilesPaths, {
  //   target: ts.ScriptTarget.ESNext,
  //   module: ts.ModuleKind.ESNext,
  //   moduleResolution: ts.ModuleResolutionKind.Bundler,
  //   // rootDir: output
  // });

  // NOTE: this check does not work
  // if (!emitResult.emittedFiles?.length) {
  //   console.log("i18n: TypeScript compilation did not emit any file");
  //   return;
  // }

  // // rename ESM output files
  // tsFiles.forEach((file) => {
  //   const absolutePath = join(cwd, output, file.path.replace(/\.tsx?$/, ".js"));
  //   addFileToGitignoreLists(config, {
  //     ...file,
  //     path: file.path.replace(/\.tsx?$/, ".mjs"),
  //   });

  //   renameSync(absolutePath, absolutePath.replace(/\.js$/, ".mjs"));
  // });

  // // CommonJs output
  // tsCompile(cwd, output, tsFilesPaths, {
  //   module: ts.ModuleKind.CommonJS,
  //   // moduleResolution: ts.ModuleResolutionKind.Node16,
  // });

  tsFiles.forEach((file) => {
    addFileToGitignoreLists(config, {
      ...file,
      path: file.path.replace(/\.tsx?$/, ".js"),
    });

    addFileToGitignoreLists(config, {
      ...file,
      path: file.path.replace(/\.tsx?$/, ".d.ts"),
    });

    // TODO: we should only compile the $t function for webpack to work...
    // dynamic imports break here
    // remove TypeScript source files
    config.files.delete(file.path);
    rmSync(join(cwd, output, file.path), { force: true });
  });
}

async function writeTranslationsFiles(
  config: CodeWriteConfig,
  { translationFiles }: I18nCompiler.DataInput,
) {
  const { cwd, output, copyTranslations } = config;

  if (!copyTranslations) return;

  Promise.all(
    translationFiles.map(async ({ data, locale, path }) => {
      const relativePath = join(getTranslationsDir(0), locale);
      await fsWrite(
        join(cwd, output, relativePath, path),
        JSON.stringify(data),
      );
      config.folders.add(relativePath);
    }),
  );
}

function writeTranslationsFilesSync(
  config: CodeWriteConfig,
  { translationFiles }: I18nCompiler.DataInput,
) {
  const { cwd, output, copyTranslations } = config;

  if (!copyTranslations) return;

  translationFiles.forEach(({ data, locale, path }) => {
    const relativePath = join(getTranslationsDir(0), locale);
    fsWriteSync(join(cwd, output, relativePath, path), JSON.stringify(data));
    config.folders.add(relativePath);
  });
}

function writeGitignore(config: CodeWriteConfig) {
  const { cwd, output, gitignore } = config;

  if (!gitignore) return;

  let content = "";

  if (gitignore === "granular") {
    content = Array.from(new Set([...config.folders, ...config.files]))
      .sort()
      .map((relativePath) => `/${relativePath}`)
      .join(`\n`);
  } else if (gitignore === "all") {
    content = ["**/*", "!.gitignore"].join("\n");
  }

  fsWriteSync(join(cwd, output, ".gitignore"), content);
}

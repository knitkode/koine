/**
 * @file
 *
 * Inspired by https://github.com/nrwl/nx/blob/master/packages/js/src/executors/tsc/tsc.impl.ts
 */
import { join, basename, dirname, extname, resolve, relative } from "path";
import { move, remove, removeSync, ensureDir } from "fs-extra";
import { glob } from "glob";
import { ExecutorContext, readJsonFile, writeJsonFile } from "@nrwl/devkit";
import {
  assetGlobsToFiles,
  FileInputOutput,
} from "@nrwl/workspace/src/utilities/assets";
import { checkDependencies } from "@nrwl/js/src/utils/check-dependencies";
import { CopyAssetsHandler } from "@nrwl/js/src/utils/copy-assets-handler";
import {
  ExecutorOptions,
  NormalizedExecutorOptions,
} from "@nrwl/js/src/utils/schema";
import { addTslibDependencyIfNeeded } from "@nrwl/js/src/utils/tslib-dependency";
import { compileTypeScriptFiles } from "@nrwl/js/src/utils/typescript/compile-typescript-files";
import { updatePackageJson } from "@nrwl/js/src/utils/update-package-json";
import { watchForSingleFileChanges } from "@nrwl/js/src/utils/watch-for-single-file-changes";
import type { CompilerOptions } from "typescript";
// import { rollupExecutor } from "./rollup";
import { tsupExecutor } from "./tsup";
// import { convertNxExecutor }  '@nrwl/devkit';

// we follow the same structure as in @mui packages builds
const TMP_FOLDER_CJS = "node";
const TMP_FOLDER_MODERN = ".modern";
const DEST_FOLDER_CJS = "node";
const DEST_FOLDER_MODERN = "";

/**
 * Copied from @nrwl/nx
 *
 * @see https://github.com/nrwl/nx/blob/master/packages/nx/src/command-line/workspace-generators.ts#L23-L30
 */
type TsConfig = {
  extends: string;
  compilerOptions: CompilerOptions;
  files?: string[];
  include?: string[];
  exclude?: string[];
  references?: Array<{ path: string }>;
};

/**
 *
 * @see https://github.com/nrwl/nx/blob/master/packages/nx/src/command-line/workspace-generators.ts#L171-L188
 */
function createTmpTsConfig(
  tsconfigPath: string,
  updateConfig: Partial<TsConfig>
) {
  const tmpTsConfigPath = join(
    dirname(tsconfigPath),
    `.tsconfig.${performance.now()}.json`
  );
  const originalTSConfig = readJsonFile<TsConfig>(tsconfigPath);
  const generatedTSConfig: TsConfig = {
    ...originalTSConfig,
    ...updateConfig,
  };
  process.on("exit", () => cleanupTmpTsConfigFile(tmpTsConfigPath));
  writeJsonFile(tmpTsConfigPath, generatedTSConfig);

  return tmpTsConfigPath;
}

/**
 *
 * @see https://github.com/nrwl/nx/blob/master/packages/nx/src/command-line/workspace-generators.ts#L190-L194
 */
function cleanupTmpTsConfigFile(tmpTsConfigPath: string) {
  if (tmpTsConfigPath) {
    removeSync(tmpTsConfigPath);
  }
}

function concatPaths(...args: string[]) {
  // always prepend a slash
  return `/${args
    // remove initial slashes and ending slashes
    .map((p) => p.replace(/$\/+/, "").replace(/\/+$/, ""))
    // remove empty parts
    .filter((p) => p)
    //join by slash
    .join("/")}`;
}

async function treatModernOutput(options: NormalizedExecutorOptions) {
  const { outputPath } = options;
  const tmpOutputPath = join(outputPath, TMP_FOLDER_MODERN);
  const destOutputPath = join(outputPath, DEST_FOLDER_MODERN);
  const entrypointsDirs: string[] = [];

  return new Promise<typeof entrypointsDirs>((resolve) => {
    glob(
      "**/*.{ts,js}",
      { cwd: tmpOutputPath },
      async function (er, relativePaths) {
        await Promise.all(
          relativePaths.map(async (relativePath) => {
            const dir = dirname(relativePath);
            const ext = extname(relativePath);
            const fileName = basename(relativePath, ext);
            const srcFile = join(tmpOutputPath, relativePath);
            const destFile = join(destOutputPath, relativePath);

            if (srcFile !== destFile) {
              await move(srcFile, destFile);
            }
            
            // only write package.json file deeper than the root and when we have an `index` entry file
            if (fileName === "index" && dir && dir !== ".") {
              const destDir = join(destOutputPath, dir);
              const destModernDir = destDir;
              const destCjsDir = join(outputPath, DEST_FOLDER_CJS, dir)

              // populate the entrypointsDirs array
              entrypointsDirs.push(dir);

              writeJsonFile(
                join(destDir, "./package.json"),
                getPackageJsonData(destDir, destModernDir, destCjsDir)
              );
            }
          })
        );

        await remove(tmpOutputPath);

        resolve(entrypointsDirs);
      }
    );
  });
}

async function treatCjsOutput(options: NormalizedExecutorOptions) {
  const { outputPath } = options;
  const tmpOutputPath = join(outputPath, TMP_FOLDER_CJS);
  const destOutputPath = join(outputPath, DEST_FOLDER_CJS);

  return new Promise((resolve) => {
    if (tmpOutputPath === destOutputPath) {
      resolve(true);
      return;
    }

    glob("**/*.js", { cwd: tmpOutputPath }, async function (er, relativePaths) {
      await ensureDir(destOutputPath);

      await Promise.all(
        relativePaths.map(async (relativePath) => {
          const srcFile = join(tmpOutputPath, relativePath);
          const destFile = join(destOutputPath, relativePath);

          if (srcFile !== destFile) {
            await move(srcFile, destFile);
          }
        })
      );

      await remove(tmpOutputPath);

      resolve(true);
    });
  });
}

/**
 * We treat these seprataly as they carry the `dependencies` of the actual
 * packages
 */
async function treatRootEntrypoints(options: NormalizedExecutorOptions) {
  const { outputPath } = options;
  const packagePath = join(outputPath, "./package.json");
  const packageJson = readJsonFile(packagePath);

  return new Promise((resolve) => {
    writeJsonFile(packagePath, Object.assign(packageJson, getPackageJsonData(outputPath, join(outputPath, DEST_FOLDER_MODERN), join(outputPath, DEST_FOLDER_CJS))));
    resolve(true);
  });
}

function getPackageJsonData(pkgPath, modernPath, cjsPath) {
  let modernFile = relative(pkgPath, join(modernPath, "index.js"));
  let cjsFile = relative(pkgPath, join(cjsPath, "index.js"));
  let umdFile = relative(pkgPath, join(modernPath, "umd", "index.js"));
  
  if (!modernFile.startsWith(".")) modernFile = `./${modernFile}`;
  if (!cjsFile.startsWith(".")) cjsFile = `./${cjsFile}`;
  if (!umdFile.startsWith(".")) umdFile = `./${umdFile}`;

  return {
    sideEffects: false,
    module: modernFile,
    main: cjsFile,
    // @see https://webpack.js.org/guides/package-exports/
    exports: {
      // we use tsup `cjs`, @see https://tsup.egoist.sh/#bundle-formats
      development: umdFile,
      default: modernFile,
      // FIXME: this should not point to parent folders according to the linting
      // on the package.json, it is probably not needed anyway as we already
      // have `main` key in the package.json
      // node: cjsFile,
    },
    types: modernFile.replace(".js", ".d.ts"),
  };
}

function normalizeOptions(
  options: ExecutorOptions,
  contextRoot: string,
  sourceRoot?: string,
  projectRoot?: string
): NormalizedExecutorOptions {
  const outputPath = join(contextRoot, options.outputPath);

  if (options.watch == null) {
    options.watch = false;
  }

  const files: FileInputOutput[] = assetGlobsToFiles(
    options.assets,
    contextRoot,
    outputPath
  );

  return {
    ...options,
    root: contextRoot,
    sourceRoot,
    projectRoot,
    files,
    outputPath,
    tsConfig: join(contextRoot, options.tsConfig),
    mainOutputPath: resolve(
      outputPath,
      options.main.replace(`${projectRoot}/`, "").replace(".ts", ".js")
    ),
  };
}

async function* executor(_options: ExecutorOptions, context: ExecutorContext) {
  const { sourceRoot, root } = context.workspace.projects[context.projectName];
  const options = normalizeOptions(_options, context.root, sourceRoot, root);
  let entrypointsDirs: string[] = [];
  const { projectRoot, tmpTsConfig, target, dependencies } = checkDependencies(
    context,
    _options.tsConfig
  );

  if (tmpTsConfig) {
    options.tsConfig = tmpTsConfig;
  }

  addTslibDependencyIfNeeded(options, context, dependencies);

  const assetHandler = new CopyAssetsHandler({
    projectDir: projectRoot,
    rootDir: context.root,
    outputDir: _options.outputPath,
    assets: _options.assets,
  });

  if (options.watch) {
    const disposeWatchAssetChanges =
      await assetHandler.watchAndProcessOnAssetChange();
    const disposePackageJsonChanged = await watchForSingleFileChanges(
      join(context.root, projectRoot),
      "package.json",
      () => updatePackageJson(options, context, target, dependencies)
    );
    process.on("exit", async () => {
      await disposeWatchAssetChanges();
      await disposePackageJsonChanged();
    });
    process.on("SIGTERM", async () => {
      await disposeWatchAssetChanges();
      await disposePackageJsonChanged();
    });
  }

  const tmpTsConfigPath = createTmpTsConfig(options.tsConfig, {});
  const tmpTsConfigFile = readJsonFile(tmpTsConfigPath);
  const tmpOptions = Object.assign({}, options);
  // store initial tsConfig
  const initialTsConfig = Object.assign({}, tmpTsConfigFile);

  // restore initial tsConfig
  process.on("exit", async () => {
    writeJsonFile(options.tsConfig, initialTsConfig);
  });
  process.on("SIGTERM", async () => {
    writeJsonFile(options.tsConfig, initialTsConfig);
  });

  // immediately output a package.json file
  updatePackageJson(options, context, target, dependencies);

  // generate Modern:
  // ---------------------------------------------------------------------------
  tmpTsConfigFile.compilerOptions.module = "esnext";
  tmpTsConfigFile.compilerOptions.composite = true;
  tmpTsConfigFile.compilerOptions.declaration = true;
  writeJsonFile(options.tsConfig, tmpTsConfigFile);

  tmpOptions.outputPath = join(options.outputPath, TMP_FOLDER_MODERN);

  yield* compileTypeScriptFiles(tmpOptions, context, async () => {
    await assetHandler.processAllAssetsOnce();

    entrypointsDirs = await treatModernOutput(options);
  });

  // generate CommonJS:
  // ---------------------------------------------------------------------------
  tmpTsConfigFile.compilerOptions.module = "commonjs";
  tmpTsConfigFile.compilerOptions.composite = false;
  tmpTsConfigFile.compilerOptions.declaration = false;
  tmpTsConfigFile.skipLibCheck = true;
  writeJsonFile(options.tsConfig, tmpTsConfigFile);

  tmpOptions.outputPath = join(options.outputPath, TMP_FOLDER_CJS);

  yield* compileTypeScriptFiles(tmpOptions, context, async () => {
    await treatCjsOutput(options);
    await treatRootEntrypoints(options);
    
    // restore initial tsConfig
    writeJsonFile(options.tsConfig, initialTsConfig);
  });
  
  // generate UMD dev bundle:
  // ---------------------------------------------------------------------------
  tmpTsConfigFile.compilerOptions.module = "esnext";
  tmpTsConfigFile.compilerOptions.composite = true;
  tmpTsConfigFile.compilerOptions.declaration = true;
  
  // return yield* rollupExecutor(options, context, dependencies, entrypointsDirs);
  yield* tsupExecutor(options, context, dependencies, entrypointsDirs);

  return { success: true };
}

export default executor;
// @see https://github.com/nrwl/nx/blob/master/packages/js/src/executors/tsc/compat.ts
// not sure if that is needed, locally it works only without it, no time to investigate now
// export default convertNxExecutor(executor);

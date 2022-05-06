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
// import { convertNxExecutor }  '@nrwl/devkit';

// we follow the same structure @mui packages builds
const TMP_FOLDER_CJS = ".node";
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

async function treatCjsOutput(options: NormalizedExecutorOptions) {
  const { outputPath } = options;
  const tmpOutputPath = join(outputPath, TMP_FOLDER_CJS);

  await ensureDir(join(outputPath, DEST_FOLDER_CJS));

  return new Promise((resolve) => {
    glob("**/*.js", { cwd: tmpOutputPath }, async function (er, relativePaths) {
      await Promise.all(
        relativePaths.map(async (relativePath) => {
          const dir = dirname(relativePath);
          const ext = extname(relativePath);
          const fileName = basename(relativePath, ext);
          const srcFile = join(tmpOutputPath, relativePath);
          const destDir = join(outputPath, DEST_FOLDER_CJS, dir);
          const destFile = join(destDir, `${fileName}${ext}`);

          await move(srcFile, destFile);
        })
      );

      await remove(tmpOutputPath);

      resolve(true);
    });
  });
}

async function treatModernOutput(options: NormalizedExecutorOptions) {
  const { outputPath } = options;
  const tmpOutputPath = join(outputPath, TMP_FOLDER_MODERN);

  return new Promise((resolve) => {
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
            const destDir = join(outputPath, DEST_FOLDER_MODERN, dir);
            const destFile = join(destDir, `${fileName}${ext}`);

            await move(srcFile, destFile);

            // only write package.json file deeper than the root and when we have an `index` entry file
            if (fileName === "index" && dir && dir !== ".") {
              const destCjsDir = join(outputPath, DEST_FOLDER_CJS, dir);

              writeJsonFile(join(destDir, "./package.json"), {
                sideEffects: false,
                module: `./index.js`,
                main: join(relative(destDir, destCjsDir), `index.js`),
                types: `./index.d.ts`,
              });
            }
          })
        );

        await remove(tmpOutputPath);

        resolve(true);
      }
    );
  });
}

async function treatEntrypoints(options: NormalizedExecutorOptions) {
  const { outputPath } = options;
  const packagePath = join(outputPath, "./package.json");
  const packageJson = readJsonFile(packagePath);

  return new Promise((resolve) => {
    packageJson.main = `.${concatPaths(DEST_FOLDER_CJS, "index.js")}`;
    packageJson.module = `.${concatPaths(DEST_FOLDER_MODERN, "index.js")}`;
    writeJsonFile(packagePath, packageJson);
    resolve(true);
  });
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
  const initialTsConfig = Object.assign({}, tmpTsConfigFile);

  // immediately output a package.json file
  updatePackageJson(options, context, target, dependencies);

  // generate CommonJS:
  // ---------------------------------------------------------------------------
  tmpTsConfigFile.compilerOptions.module = "commonjs";
  tmpTsConfigFile.compilerOptions.composite = false;
  tmpTsConfigFile.compilerOptions.declaration = false;
  writeJsonFile(options.tsConfig, tmpTsConfigFile);

  tmpOptions.outputPath = join(options.outputPath, `/${TMP_FOLDER_CJS}`);

  yield* compileTypeScriptFiles(tmpOptions, context, async () => {
    await assetHandler.processAllAssetsOnce();
    updatePackageJson(options, context, target, dependencies);
  });

  // generate Modern:
  // ---------------------------------------------------------------------------
  tmpTsConfigFile.compilerOptions.module = "esnext";
  tmpTsConfigFile.compilerOptions.composite = true;
  tmpTsConfigFile.compilerOptions.declaration = true;
  writeJsonFile(options.tsConfig, tmpTsConfigFile);

  tmpOptions.outputPath = join(options.outputPath, `/${TMP_FOLDER_MODERN}`);

  return yield* compileTypeScriptFiles(tmpOptions, context, async () => {
    await treatCjsOutput(options);
    await treatModernOutput(options);
    await treatEntrypoints(options);

    writeJsonFile(options.tsConfig, initialTsConfig);
  });
}

export default executor;
// @see https://github.com/nrwl/nx/blob/master/packages/js/src/executors/tsc/compat.ts
// not sure if that is needed, locally it works only without it, no time to investigate now
// export default convertNxExecutor(executor);

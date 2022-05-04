import { ExecutorContext, readJsonFile, writeJsonFile } from "@nrwl/devkit";
import { glob } from "glob";
import { move, ensureDir } from "fs-extra";
// import { ExecutorContext } from '@nrwl/devkit';
// import {
//   assetGlobsToFiles,
//   FileInputOutput,
// } from '@nrwl/workspace/src/utilities/assets';
import { join, basename, dirname, extname, resolve, relative } from "path";
// import { checkDependencies } from '@nrwl/js/src/utils/check-dependencies';
// import { CopyAssetsHandler } from '@nrwl/js/src/utils/copy-assets-handler';
// import { ExecutorOptions, NormalizedExecutorOptions } from '@nrwl/js/src/utils/schema';
// import { addTslibDependencyIfNeeded } from '@nrwl/js/src/utils/tslib-dependency';
// import { compileTypeScriptFiles } from '@nrwl/js/src/utils/typescript/compile-typescript-files';
// import { updatePackageJson } from '@nrwl/js/src/utils/update-package-json';
// import { watchForSingleFileChanges } from '@nrwl/js/src/utils/watch-for-single-file-changes';

export interface MultipleExecutorOptions {}

async function treatTsupOutput(
  options: MultipleExecutorOptions,
  context: ExecutorContext
) {
  const { projectName } = context;
  const libDist = join("./dist", projectName);
  const cjsFolder = join(libDist, "./node");

  await ensureDir(cjsFolder);

  return new Promise((resolve) => {
    glob("**/*.js", { cwd: libDist }, async function (er, relativePaths) {
      await Promise.all(
        relativePaths.map(async (relativePath) => {
          const ext = extname(relativePath);
          const dir = dirname(relativePath);
          const srcDir = join(libDist, dir);
          const srcFile = join(libDist, relativePath);
          const srcFilename = basename(relativePath, ext);
          const destCjs = join(cjsFolder, relativePath);
          const pkgDest = join(srcDir, "./package.json");

          await move(srcFile, destCjs);

          // only write package.json file deeper than the root
          if (dir && dir !== ".") {
            writeJsonFile(pkgDest, {
              sideEffects: false,
              module: `./${srcFilename}.js`,
              main: relative(srcDir, destCjs),
              types: `./${srcFilename}.d.ts`,
            });
          }
        })
      );
      resolve(true);
    });
  });
}

async function treatTscOutput(
  options: MultipleExecutorOptions,
  context: ExecutorContext
) {
  const { projectName } = context;
  const libName = `.tsc/${projectName}`;
  const libDist = join("./dist", libName);

  return new Promise((resolve) => {
    glob("**/*.{ts,js}", { cwd: libDist }, async function (er, relativePaths) {
      await Promise.all(
        relativePaths.map(async (relativePath) => {
          const srcFile = join(libDist, relativePath);
          await move(srcFile, srcFile.replace(libName, projectName));
        })
      );
      resolve(true);
    });
  });
}

async function treatEntrypoints(
  options: MultipleExecutorOptions,
  context: ExecutorContext
) {
  const { projectName } = context;
  const libDist = join("./dist", projectName);
  const packagePath = join(libDist, "./package.json");
  const packageJson = readJsonFile(packagePath);

  const exports = {};

  return new Promise((resolve) => {
    glob("*.js", { cwd: libDist }, async function (er, relativePaths) {
      await Promise.all(
        relativePaths.map(async (relativePath) => {
          const ext = extname(relativePath);
          const srcFilename = basename(relativePath, ext);
          let isIndex = srcFilename === "index";

          exports[isIndex ? "." : `./${srcFilename}`] = {
            main: `./node/${srcFilename}.js`,
            module: `./${srcFilename}.js`,
          };
        })
      );

      packageJson.main = "./node/index.js";
      packageJson.module = "./index.js";
      packageJson.exports = exports;

      writeJsonFile(packagePath, packageJson);

      resolve(true);
    });
  });
}

export default async function multipleExecutor(
  options: MultipleExecutorOptions,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  await treatTsupOutput(options, context);
  await treatTscOutput(options, context);
  await treatEntrypoints(options, context);

  return { success: true };
}

// export function normalizeOptions(
//   options: ExecutorOptions,
//   contextRoot: string,
//   sourceRoot?: string,
//   projectRoot?: string
// ): NormalizedExecutorOptions {
//   const outputPath = join(contextRoot, options.outputPath);

//   if (options.watch == null) {
//     options.watch = false;
//   }

//   const files: FileInputOutput[] = assetGlobsToFiles(
//     options.assets,
//     contextRoot,
//     outputPath
//   );

//   return {
//     ...options,
//     root: contextRoot,
//     sourceRoot,
//     projectRoot,
//     files,
//     outputPath,
//     tsConfig: join(contextRoot, options.tsConfig),
//     mainOutputPath: resolve(
//       outputPath,
//       options.main.replace(`${projectRoot}/`, '').replace('.ts', '.js')
//     ),
//   };
// }

// export async function* tscExecutor(
//   _options: ExecutorOptions,
//   context: ExecutorContext
// ) {
//   const { sourceRoot, root } = context.workspace.projects[context.projectName];
//   const options = normalizeOptions(_options, context.root, sourceRoot, root);

//   const { projectRoot, tmpTsConfig, target, dependencies } = checkDependencies(
//     context,
//     _options.tsConfig
//   );

//   if (tmpTsConfig) {
//     options.tsConfig = tmpTsConfig;
//   }

//   addTslibDependencyIfNeeded(options, context, dependencies);

//   const assetHandler = new CopyAssetsHandler({
//     projectDir: projectRoot,
//     rootDir: context.root,
//     outputDir: _options.outputPath,
//     assets: _options.assets,
//   });

//   if (options.watch) {
//     const disposeWatchAssetChanges =
//       await assetHandler.watchAndProcessOnAssetChange();
//     const disposePackageJsonChanged = await watchForSingleFileChanges(
//       join(context.root, projectRoot),
//       'package.json',
//       () => updatePackageJson(options, context, target, dependencies)
//     );
//     process.on('exit', async () => {
//       await disposeWatchAssetChanges();
//       await disposePackageJsonChanged();
//     });
//     process.on('SIGTERM', async () => {
//       await disposeWatchAssetChanges();
//       await disposePackageJsonChanged();
//     });
//   }

//   return yield* compileTypeScriptFiles(options, context, async () => {
//     await assetHandler.processAllAssetsOnce();
//     updatePackageJson(options, context, target, dependencies);
//   });
// }

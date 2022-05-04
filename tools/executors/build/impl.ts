import { join, basename, dirname, extname, resolve, relative } from "path";
import { move, remove } from "fs-extra";
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
// import { convertNxExecutor } from '@nrwl/devkit';

// we follow the same structure @mui packages builds
const OUTPUT_FOLDER_CJS = "node";
const OUTPUT_FOLDER_MODERN = "modern";

async function treatModernOutput(options: NormalizedExecutorOptions) {
  const { outputPath } = options; // here we are in the `/OUTPUT_FOLDER_MODERN` subfolder

  return new Promise((resolve) => {
    glob(
      `!(${OUTPUT_FOLDER_CJS})/**/*.{ts,js}`,
      { cwd: outputPath },
      async function (er, relativePaths) {
        await Promise.all(
          relativePaths.map(async (relativePath) => {
            const dir = dirname(relativePath);
            const ext = extname(relativePath);
            const fileName = basename(relativePath, ext);
            const srcCjsFile = join(outputPath, relativePath);
            const destEsmFile = srcCjsFile.replace(
              `/${OUTPUT_FOLDER_MODERN}`,
              ""
            );
            const destEsmDir = join(outputPath, dir).replace(
              `/${OUTPUT_FOLDER_MODERN}`,
              ""
            );
            const destCjsDir = join(
              outputPath.replace(OUTPUT_FOLDER_MODERN, OUTPUT_FOLDER_CJS),
              dir
            );
            const destPkg = join(destEsmDir, "./package.json");

            await move(srcCjsFile, destEsmFile);

            // only write package.json file deeper than the root and when we have an `index` entry file
            if (fileName === "index" && dir && dir !== ".") {
              writeJsonFile(destPkg, {
                sideEffects: false,
                module: `./${fileName}.js`,
                main: join(relative(destEsmDir, destCjsDir), `${fileName}.js`),
                types: `./${fileName}.d.ts`,
              });
            }
          })
        );

        await remove(outputPath);

        resolve(true);
      }
    );
  });
}

async function treatEntrypoints(options: NormalizedExecutorOptions) {
  const libDist = options.outputPath;
  const packagePath = join(libDist, "./package.json");
  const packageJson = readJsonFile(packagePath);

  return new Promise((resolve) => {
    packageJson.main = `./${OUTPUT_FOLDER_CJS}/index.js`;
    packageJson.module = "./index.js";
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

  const tsConfigGenerated = readJsonFile(options.tsConfig);
  const initialOutputPath = options.outputPath;

  // immediately output a package.json file
  updatePackageJson(options, context, target, dependencies);

  // generate CommonJS:
  // ---------------------------------------------------------------------------
  tsConfigGenerated.compilerOptions.module = "commonjs";
  tsConfigGenerated.compilerOptions.declaration = false;
  writeJsonFile(options.tsConfig, tsConfigGenerated);

  options.outputPath = join(initialOutputPath, `/${OUTPUT_FOLDER_CJS}`);

  yield* compileTypeScriptFiles(options, context, async () => {
    await assetHandler.processAllAssetsOnce();
    updatePackageJson(options, context, target, dependencies);
  });

  // generate Modern now:
  // ---------------------------------------------------------------------------
  tsConfigGenerated.compilerOptions.module = "esnext";
  tsConfigGenerated.compilerOptions.declaration = true;
  writeJsonFile(options.tsConfig, tsConfigGenerated);

  options.outputPath = join(initialOutputPath, `/${OUTPUT_FOLDER_MODERN}`);

  return yield* compileTypeScriptFiles(options, context, async () => {
    await treatModernOutput(options);

    options.outputPath = initialOutputPath;

    await treatEntrypoints(options);
  });
}

export default executor;
// export default convertNxExecutor(executor);

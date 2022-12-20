/**
 * @file
 *
 * Inspired by https://github.com/nrwl/nx/blob/master/packages/js/src/executors/tsc/tsc.impl.ts
 */
import { join, resolve } from "path";
import { ExecutorContext, readJsonFile, writeJsonFile } from "@nrwl/devkit";
import {
  assetGlobsToFiles,
  FileInputOutput,
} from "@nrwl/workspace/src/utilities/assets";
import { checkDependencies } from "@nrwl/js/src/utils/check-dependencies";
import {
  getHelperDependency,
  HelperDependency,
} from "@nrwl/js/src/utils/compiler-helper-dependency";
import { CopyAssetsHandler } from "@nrwl/js/src/utils/assets/copy-assets-handler";
import {
  handleInliningBuild,
  isInlineGraphEmpty,
  postProcessInlinedDependencies,
} from "@nrwl/js/src/utils/inline";
import {
  ExecutorOptions,
  NormalizedExecutorOptions,
} from "@nrwl/js/src/utils/schema";
import { compileTypeScriptFiles } from "@nrwl/js/src/utils/typescript/compile-typescript-files";
import { updatePackageJson } from "@nrwl/js/src/utils/package-json/update-package-json";
import { watchForSingleFileChanges } from "@nrwl/js/src/utils/watch-for-single-file-changes";
import { createTypeScriptCompilationOptions } from "@nrwl/js/src/executors/tsc/tsc.impl";

// we follow the same structure as in @mui packages builds
const TMP_FOLDER_MODERN = ".modern";

function normalizeOptions(
  options: ExecutorOptions,
  contextRoot: string,
  sourceRoot: string,
  projectRoot: string
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
  const { sourceRoot, root } = context.workspace.projects[context.projectName!];
  const options = normalizeOptions(_options, context.root, sourceRoot!, root);
  const { projectRoot, tmpTsConfig, target, dependencies } = checkDependencies(
    context,
    _options.tsConfig
  );

  if (tmpTsConfig) {
    options.tsConfig = tmpTsConfig;
  }

  const tsLibDependency = getHelperDependency(
    HelperDependency.tsc,
    options.tsConfig,
    dependencies,
    context.projectGraph!
  );

  if (tsLibDependency) {
    dependencies.push(tsLibDependency);
  }

  const assetHandler = new CopyAssetsHandler({
    projectDir: projectRoot,
    rootDir: context.root,
    outputDir: _options.outputPath,
    assets: _options.assets,
  });

  const tsCompilationOptions = createTypeScriptCompilationOptions(
    options,
    context
  );

  const inlineProjectGraph = handleInliningBuild(
    context,
    options,
    tsCompilationOptions.tsConfig
  );

  if (!isInlineGraphEmpty(inlineProjectGraph)) {
    tsCompilationOptions.rootDir = ".";
  }

  // store initial tsConfig
  const initialTsConfig = readJsonFile(options.tsConfig);
  const tsConfig = readJsonFile(options.tsConfig);
  const tmpOptions = Object.assign({}, options);

  // restore initial tsConfig
  process.on("exit", async () => {
    writeJsonFile(options.tsConfig, initialTsConfig);
  });
  process.on("SIGTERM", async () => {
    writeJsonFile(options.tsConfig, initialTsConfig);
  });

  // generate Modern:
  // ---------------------------------------------------------------------------
  tsConfig.compilerOptions.module = "esnext";
  tsConfig.compilerOptions.composite = true;
  tsConfig.compilerOptions.declaration = true;
  writeJsonFile(options.tsConfig, tsConfig);

  tsCompilationOptions.outputPath = tmpOptions.outputPath = join(
    options.outputPath,
    TMP_FOLDER_MODERN
  );

  const typescriptCompilation = compileTypeScriptFiles(
    tmpOptions,
    tsCompilationOptions,
    async () => {
      await assetHandler.processAllAssetsOnce();
      updatePackageJson(options, context, target, dependencies);
      postProcessInlinedDependencies(
        tsCompilationOptions.outputPath,
        tsCompilationOptions.projectRoot,
        inlineProjectGraph
      );
    }
  );

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

  return yield* typescriptCompilation.iterator;
}

export default executor;

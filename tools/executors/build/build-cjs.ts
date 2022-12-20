/**
 * @file
 *
 * Inspired by https://github.com/nrwl/nx/blob/master/packages/js/src/executors/tsc/tsc.impl.ts
 */
import { join, basename, dirname, extname, resolve, relative } from "path";
import { move, remove } from "fs-extra";
import { glob } from "glob";
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
const TMP_FOLDER_MODERN = "../.modern";
const DEST_FOLDER_MODERN = "../";
const DEST_FOLDER_CJS = "../node";

async function treatEsmOutput(options: NormalizedExecutorOptions) {
  const { outputPath } = options;
  const tmpOutputPath = join(outputPath, TMP_FOLDER_MODERN);
  const destOutputPath = join(outputPath, DEST_FOLDER_MODERN);
  const entrypointsDirs: string[] = [];

  return new Promise<typeof entrypointsDirs>((resolve) => {
    glob(
      "**/*.{js,json,ts}",
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
              await move(srcFile, destFile, { overwrite: true });
            }

            // only write package.json file deeper than the root and when whave
            // an `index` entry file
            if (fileName === "index" && dir && dir !== ".") {
              const destDir = join(destOutputPath, dir);
              const destModernDir = destDir;
              const destCjsDir = join(outputPath, DEST_FOLDER_CJS, dir);

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

        // console.log("treatEsmOutput: entrypointsDirs", entrypointsDirs);
        resolve(entrypointsDirs);
      }
    );
  });
}

/**
 * We treat these separetely as they carry the `dependencies` of the actual
 * packages
 */
async function treatRootEntrypoint(options: NormalizedExecutorOptions) {
  const { outputPath } = options;
  const packagePath = join(outputPath, "../package.json");
  const packageJson = readJsonFile(packagePath);
  const rootPackageJson = readJsonFile(join(options.root!, "./package.json"));
  // console.log("rootPackageJson", rootPackageJson)

  return new Promise((resolve) => {
    writeJsonFile(
      packagePath,
      Object.assign(
        packageJson,
        {
          version: rootPackageJson.version,
          // @see https://nodejs.org/api/packages.html#approach-1-use-an-es-module-wrapper
          // we disable rollup bundles for now
          // exports: {
          //   import: "./index.esm.js",
          //   require: "./index.cjs.js"
          // }
        },
        getPackageJsonData(
          join(outputPath, "../"),
          join(outputPath, DEST_FOLDER_MODERN),
          join(outputPath, DEST_FOLDER_CJS)
        )
      )
    );
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
    // exports: {
    //   // we use tsup `cjs`, @see https://tsup.egoist.sh/#bundle-formats
    //   development: umdFile,
    //   default: modernFile,
    //   // FIXME: this should not point to parent folders according to the linting
    //   // on the package.json, it is probably not needed anyway as we already
    //   // have `main` key in the package.json
    //   // node: cjsFile,
    // },
    types: modernFile.replace(".js", ".d.ts"),
  };
}

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
  // console.log("options.tsConfig", options.tsConfig);
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

  // generate CommonJS:
  // ---------------------------------------------------------------------------
  tsConfig.compilerOptions.module = "commonjs";
  tsConfig.compilerOptions.composite = false;
  tsConfig.compilerOptions.declaration = false;
  tsConfig.skipLibCheck = true;
  writeJsonFile(options.tsConfig, tsConfig);

  // moved dest innerr folder to outputPath option in project.json
  // tsCompilationOptions.outputPath = tmpOptions.outputPath = join(
  //   options.outputPath,
  //   DEST_FOLDER_CJS
  // );

  const typescriptCompilation = compileTypeScriptFiles(
    tmpOptions,
    tsCompilationOptions,
    async () => {
      await treatEsmOutput(options);
      // await treatCjsOutput(options);
      await treatRootEntrypoint(options);
      // restore initial tsConfig
      writeJsonFile(options.tsConfig, initialTsConfig);
    }
  );

  if (options.watch) {
    const disposePackageJsonChanged = await watchForSingleFileChanges(
      join(context.root, projectRoot),
      "package.json",
      () => updatePackageJson(options, context, target, dependencies)
    );
    process.on("exit", async () => {
      await disposePackageJsonChanged();
    });
    process.on("SIGTERM", async () => {
      await disposePackageJsonChanged();
    });
  }

  return yield* typescriptCompilation.iterator;
}

export default executor;

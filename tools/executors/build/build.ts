/**
 * @file
 *
 * Inspired by https://github.com/nx/nx/blob/master/packages/js/src/executors/tsc/tsc.impl.ts
 */
import { basename, dirname, extname, join, relative } from "path";
import { copy, move, readJSON, remove, removeSync } from "fs-extra";
import { glob } from "glob";
import { ExecutorContext, readJsonFile, writeJsonFile } from "@nx/devkit";
import {
  ExecutorOptions,
  // NormalizedExecutorOptions,
  // SwcExecutorOptions,
} from "@nx/js/src/utils/schema";
// import { compileSwc } from "@nx/js/src/utils/swc/compile-swc";
import { swcExecutor } from "@nx/js/src/executors/swc/swc.impl";
import { tscExecutor } from "@nx/js/src/executors/tsc/tsc.impl";
import { type TsConfigJson } from "type-fest";
import { existsSync } from "fs";

type BundleType = "es6" | "commonjs";

const BUNDLE_TYPE_ESM: BundleType = "es6";
const BUNDLE_TYPE_COMMONJS: BundleType = "commonjs";
const DEFAULT_BUNDLE_TYPE = BUNDLE_TYPE_ESM;

const bundleTypes: BundleType[] = [BUNDLE_TYPE_ESM, BUNDLE_TYPE_COMMONJS];

async function treatEsmOutput(options: ExecutorOptions) {
  const { outputPath } = options;
  const tmpPath = getOutputPath(options, BUNDLE_TYPE_ESM);
  const entrypointsDirs: string[] = [];

  const relativePaths = await glob("**/*.{js,json,ts}", {
    cwd: tmpPath,
    ignore: `${BUNDLE_TYPE_COMMONJS}/**/*`,
  });

  await Promise.all(
    relativePaths.map(async (relativePath) => {
      const dir = dirname(relativePath);
      const ext = extname(relativePath);
      const fileName = basename(relativePath, ext);
      const srcFile = join(tmpPath, relativePath);
      let destFile = join(outputPath, relativePath);

      if (ext === ".js") destFile = destFile.replace(".js", ".mjs");

      if (srcFile !== destFile) {
        await move(srcFile, destFile, {
          overwrite: true,
        });
      }

      // only write package.json file deeper than the root and when whave
      // an `index` entry file
      if (fileName === "index" && dir && dir !== ".") {
        const destDir = join(outputPath, dir);
        const destEsmDir = destDir;
        const destCjsDir = join(outputPath, `/${BUNDLE_TYPE_COMMONJS}/`, dir);

        entrypointsDirs.push(dir);

        writeJsonFile(
          join(destDir, "./package.json"),
          getPackageJsonData(destDir, destEsmDir, destCjsDir)
        );
      }
    })
  );

  return entrypointsDirs;
}

async function treatCjsOutput(options: ExecutorOptions) {
  const { outputPath } = options;
  const tmpPath = getOutputPath(options, BUNDLE_TYPE_COMMONJS);
  const entrypointsDirs: string[] = [];
  const relativePaths = await glob("**/*.{js,json,ts}", { cwd: tmpPath });

  await Promise.all(
    relativePaths.map(async (relativePath) => {
      const srcFile = join(tmpPath, relativePath);
      const destFile = join(outputPath, relativePath);

      if (srcFile !== destFile) {
        await move(srcFile, destFile, { overwrite: true });
      }
    })
  );

  return entrypointsDirs;
}

/**
 * We treat these separetely as they carry the `dependencies` of the actual
 * packages
 */
async function treatRootEntrypoint(options: ExecutorOptions) {
  const { outputPath } = options;
  const packagePath = join(outputPath, "./package.json");
  if (!existsSync(packagePath)) {
    return;
  }

  const packageJson = readJsonFile(packagePath);

  return new Promise((resolve) => {
    writeJsonFile(
      packagePath,
      Object.assign(
        packageJson,
        {
          // version: packageJson.version,
          // type: "module",
          // @see https://nodejs.org/api/packages.html#approach-1-use-an-es-module-wrapper
          // we disable rollup bundles for now
          // exports: {
          //   import: "./index.esm.js",
          //   require: "./index.cjs.js"
          // }
        },
        getPackageJsonData(join(outputPath), join(outputPath), join(outputPath))
      )
    );

    resolve(true);
  });
}

function getPackageJsonData(pkgPath: string, esmPath: string, cjsPath: string) {
  let esmFile = relative(pkgPath, join(esmPath, "index.mjs"));
  let cjsFile = relative(pkgPath, join(cjsPath, "index.js"));
  let umdFile = relative(pkgPath, join(esmPath, "umd", "index.js"));

  if (!esmFile.startsWith(".")) esmFile = `./${esmFile}`;
  if (!cjsFile.startsWith(".")) cjsFile = `./${cjsFile}`;
  if (!umdFile.startsWith(".")) umdFile = `./${umdFile}`;

  return {
    sideEffects: false,
    module: esmFile,
    main: cjsFile,
    // @see https://webpack.js.org/guides/package-exports/
    // exports: {
    //   // we use tsup `cjs`, @see https://tsup.egoist.sh/#bundle-formats
    //   development: umdFile,
    //   default: es6File,
    //   // FIXME: this should not point to parent folders according to the linting
    //   // on the package.json, it is probably not needed anyway as we already
    //   // have `main` key in the package.json
    //   // node: cjsFile,
    // },
    types: cjsFile.replace(".js", ".d.ts"),
  };
}

function manageTsConfig(
  options: ExecutorOptions,
  context: ExecutorContext,
  bundleType: BundleType
) {
  const { src, dest, destRelative } = getConfigFilePathTsc(
    options,
    context,
    bundleType
  );
  const data = readJsonFile(src) as TsConfigJson;

  data.compilerOptions =
    data.compilerOptions ||
    ({} as NonNullable<TsConfigJson["compilerOptions"]>);
  // data.compilerOptions.module = bundleType;
  data.compilerOptions.module = bundleType === "es6" ? "esnext" : "commonjs";
  // TODO: .d.ts files were created earlier by swc already
  // data.compilerOptions.declaration = false;
  // data.compilerOptions.composite = false;

  writeJsonFile(dest, data);
  return destRelative;
}

function manageSwcrc(
  options: ExecutorOptions,
  context: ExecutorContext,
  bundleType: BundleType
) {
  const { src, dest, destRelative } = getConfigFilePathSwc(
    options,
    context,
    bundleType
  );

  if (existsSync(src)) {
    // TODO: type SWC options
    const data = readJsonFile(src) as any;

    data.module.type = bundleType;
    // TODO: this is unrelated to this bundler probably, it should an option I
    // or just removed from here, too opinionated
    data.minify = true;

    writeJsonFile(dest, data);
    return destRelative;
  }

  return;
}

function getOutputPath(options: ExecutorOptions, bundleType: BundleType) {
  let { outputPath } = options;

  if (bundleType === DEFAULT_BUNDLE_TYPE) {
    return outputPath;
  }

  return outputPath + "/" + bundleType;
}

function manageOptions(
  options: ExecutorOptions,
  context: ExecutorContext,
  bundleType: BundleType
): Pick<ExecutorOptions, "tsConfig" | "swcrc" | "outputPath"> {
  const tsConfig = manageTsConfig(options, context, bundleType);
  const swcrc = manageSwcrc(options, context, bundleType);
  const outputPath = getOutputPath(options, bundleType);

  return {
    tsConfig,
    swcrc,
    outputPath,
  };
}

function getConfigFilePathTsc(
  options: ExecutorOptions,
  context: ExecutorContext,
  bundleType: BundleType
) {
  const srcRelative = options.tsConfig;
  const destRelative = srcRelative.replace(
    "tsconfig",
    "tsconfig-" + bundleType
  );
  const src = join(context.root, srcRelative);
  const dest = join(context.root, destRelative);

  return { src, dest, destRelative };
}

function getConfigFilePathSwc(
  options: ExecutorOptions,
  context: ExecutorContext,
  bundleType: BundleType
) {
  const srcRelative =
    options.swcrc || options.tsConfig.replace("tsconfig.lib.json", ".swcrc");
  const destRelative = srcRelative.replace("swcrc", "swcrc-" + bundleType);
  const src = join(context.root, srcRelative);
  const dest = join(context.root, destRelative);
  return { src, dest, destRelative };
}

async function* executor(options: ExecutorOptions, context: ExecutorContext) {
  if (!context.workspace || !context.projectName) return;

  let custom = manageOptions(options, context, "es6");

  const handleTermination = () => {
    for (let i = 0; i < bundleTypes.length; i++) {
      const bundleType = bundleTypes[i];
      const { dest: destTsconfig } = getConfigFilePathTsc(
        options,
        context,
        bundleType
      );
      const { dest: destSwcrc } = getConfigFilePathSwc(
        options,
        context,
        bundleType
      );

      removeSync(destTsconfig);
      if (custom.swcrc) removeSync(destSwcrc);

      if (bundleType !== DEFAULT_BUNDLE_TYPE) {
        removeSync(getOutputPath(options, bundleType));
      }
    }
  };

  process.on("exit", handleTermination);
  process.on("SIGINT", handleTermination);
  process.on("SIGTERM", handleTermination);

  if (custom.swcrc) {
    yield* swcExecutor({ ...options, ...custom }, context);
  } else {
    yield* tscExecutor({ ...options, ...custom }, context);
  }

  // removeSync(custom.tsConfig);
  // if (custom.swcrc) removeSync(custom.swcrc);

  custom = manageOptions(options, context, "commonjs");

  const res = yield* tscExecutor({ ...options, ...custom }, context);

  // removeSync(custom.tsConfig);
  // if (custom.swcrc) removeSync(custom.swcrc);

  await treatEsmOutput(options);
  await treatCjsOutput(options);
  await treatRootEntrypoint(options);

  return res;
}

export default executor;

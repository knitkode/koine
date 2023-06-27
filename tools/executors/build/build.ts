/**
 * @file
 *
 * Inspired by https://github.com/nrwl/nx/blob/master/packages/js/src/executors/swc/swc.impl.ts
 */
import { ExecutorContext, readJsonFile, writeJsonFile } from "@nx/devkit";
import { normalizeOptions } from "@nx/js/src/executors/swc/swc.impl";
import { copyAssets } from "@nx/js/src/utils/assets";
import { checkDependencies } from "@nx/js/src/utils/check-dependencies";
import {
  HelperDependency,
  getHelperDependency,
} from "@nx/js/src/utils/compiler-helper-dependency";
import {
  handleInliningBuild,
  isInlineGraphEmpty,
  postProcessInlinedDependencies,
} from "@nx/js/src/utils/inline";
import { copyPackageJson } from "@nx/js/src/utils/package-json";
import {
  NormalizedSwcExecutorOptions,
  SwcExecutorOptions,
} from "@nx/js/src/utils/schema";
import { compileSwc, compileSwcWatch } from "@nx/js/src/utils/swc/compile-swc";
import { generateTmpSwcrc } from "@nx/js/src/utils/swc/inline";
import { Options as SWCOptions } from "@swc/core";
import { existsSync } from "fs";
import { move, removeSync } from "fs-extra";
import { glob } from "glob";
import { basename, dirname, extname, join, relative } from "path";

type BundleType = "es6" | "commonjs";

const BUNDLE_TYPE_ESM: BundleType = "es6";
const BUNDLE_TYPE_COMMONJS: BundleType = "commonjs";
const DEFAULT_BUNDLE_TYPE = BUNDLE_TYPE_ESM;

const bundleTypes: BundleType[] = [BUNDLE_TYPE_ESM, BUNDLE_TYPE_COMMONJS];

async function treatEsmOutput(options: NormalizedSwcExecutorOptions) {
  const dest = options.outputPath;
  const tmp = getTweakedSwcDestPath(options.outputPath, BUNDLE_TYPE_ESM);
  const entrypointsDirs: string[] = [];

  const relativePaths = await glob("**/*.{js,json,ts}", {
    cwd: tmp,
    ignore: options.outputPath + `/${BUNDLE_TYPE_COMMONJS}/**/*`,
  });

  await Promise.all(
    relativePaths.map(async (relativePath) => {
      const dir = dirname(relativePath);
      const ext = extname(relativePath);
      const fileName = basename(relativePath, ext);
      const srcFile = join(tmp, relativePath);
      let destFile = join(dest, relativePath);

      if (ext === ".js") destFile = destFile.replace(".js", ".mjs");

      if (srcFile !== destFile) {
        await move(srcFile, destFile, {
          overwrite: true,
        });
      }

      // only write package.json file deeper than the root and when whave
      // an `index` entry file
      // NOTE: disabled in favour of `dev libs` cli command
      // if (fileName === "index" && dir && dir !== ".") {
      //   const destDir = join(dest, dir);
      //   const destEsmDir = destDir;
      //   const destCjsDir = join(dest, `/${BUNDLE_TYPE_COMMONJS}/`, dir);

      //   entrypointsDirs.push(dir);

      //   writeJsonFile(
      //     join(destDir, "./package.json"),
      //     getPackageJsonData(destDir, destEsmDir, destCjsDir)
      //   );
      // }
    })
  );

  return entrypointsDirs;
}

async function treatCjsOutput(options: NormalizedSwcExecutorOptions) {
  const dest = options.outputPath;
  const tmp = getTweakedSwcDestPath(options.outputPath, BUNDLE_TYPE_COMMONJS);
  const entrypointsDirs: string[] = [];
  const relativePaths = await glob("**/*.{js,json,ts}", { cwd: tmp });

  await Promise.all(
    relativePaths.map(async (relativePath) => {
      const srcFile = join(tmp, relativePath);
      const destFile = join(dest, relativePath);

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
async function treatRootEntrypoint(options: NormalizedSwcExecutorOptions) {
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
    types: cjsFile.replace(".js", ".d.ts"),
  };
}

function tweakSwcrc(
  options: NormalizedSwcExecutorOptions,
  context: ExecutorContext,
  bundleType: BundleType
) {
  const src = options.swcCliOptions.swcrcPath;
  const dest = src;

  if (existsSync(src)) {
    const data = readJsonFile(src) as SWCOptions;

    data.module.type = bundleType;
    // @ts-expect-error FIX in SWC types?
    data.module.noInterop = bundleType === "es6";

    writeJsonFile(dest, data);
  }

  return;
}

function getTweakedSwcDestPath(standardPath: string, bundleType: BundleType) {
  if (bundleType === DEFAULT_BUNDLE_TYPE) {
    return standardPath;
  }

  return join(standardPath, bundleType);
}

function tweakOptions(
  options: NormalizedSwcExecutorOptions,
  context: ExecutorContext,
  bundleType: BundleType
): NormalizedSwcExecutorOptions {
  // alter the .swcrc file
  tweakSwcrc(options, context, bundleType);
  const originalSwcCliOptions = options.swcCliOptions;

  return {
    ...options,
    swcCliOptions: {
      ...originalSwcCliOptions,
      destPath: getTweakedSwcDestPath(
        options.swcCliOptions.destPath,
        bundleType
      ),
    },
  };
}

async function* executor(
  _options: SwcExecutorOptions,
  context: ExecutorContext
) {
  if (!context.workspace || !context.projectName) return;
  const { sourceRoot, root } =
    context.projectsConfigurations.projects[context.projectName];
  const options = normalizeOptions(_options, context.root, sourceRoot, root);

  // koine tweak
  const swcrcOriginalContent = readJsonFile(
    options.swcCliOptions.swcrcPath
  ) as SWCOptions;

  const { tmpTsConfig, dependencies } = checkDependencies(
    context,
    options.tsConfig
  );

  // console.log("dependencies", dependencies);

  if (tmpTsConfig) {
    options.tsConfig = tmpTsConfig;
  }

  const swcHelperDependency = getHelperDependency(
    HelperDependency.swc,
    options.swcCliOptions.swcrcPath,
    dependencies,
    context.projectGraph
  );

  if (swcHelperDependency) {
    dependencies.push(swcHelperDependency);
  }

  const inlineProjectGraph = handleInliningBuild(
    context,
    options,
    options.tsConfig
  );

  if (!isInlineGraphEmpty(inlineProjectGraph)) {
    options.projectRoot = "."; // set to root of workspace to include other libs for type check

    // remap paths for SWC compilation
    options.swcCliOptions.srcPath = options.swcCliOptions.swcCwd;
    options.swcCliOptions.swcCwd = ".";
    options.swcCliOptions.destPath = options.swcCliOptions.destPath
      .split("../")
      .at(-1)
      .concat("/", options.swcCliOptions.srcPath);

    // tmp swcrc with dependencies to exclude
    // - buildable libraries
    // - other libraries that are not dependent on the current project
    options.swcCliOptions.swcrcPath = generateTmpSwcrc(
      inlineProjectGraph,
      options.swcCliOptions.swcrcPath
    );
  }

  if (options.watch) {
    let disposeFn: () => void;
    process.on("SIGINT", () => disposeFn());
    process.on("SIGTERM", () => disposeFn());

    return yield* compileSwcWatch(context, options, async () => {
      const assetResult = await copyAssets(options, context);
      const packageJsonResult = await copyPackageJson(
        {
          ...options,
          skipTypings: !options.skipTypeCheck,
        },
        context
      );
      removeTmpSwcrc(options.swcCliOptions.swcrcPath);
      disposeFn = () => {
        assetResult?.stop();
        packageJsonResult?.stop();
      };
    });
  } else {
    // koine tweaks
    const handleTermination = () => {
      for (let i = 0; i < bundleTypes.length; i++) {
        const bundleType = bundleTypes[i];

        if (bundleType !== DEFAULT_BUNDLE_TYPE) {
          removeSync(getTweakedSwcDestPath(options.outputPath, bundleType));
        }
      }
    };

    let tweakedOptions = tweakOptions(options, context, "es6");
    console.log("ESM bundle");
    return yield compileSwc(context, tweakedOptions, async () => {
      // koine tweaks
      tweakedOptions = tweakOptions(options, context, "commonjs");
      console.log("CommonJS bundle");
      await compileSwc(context, tweakedOptions, async () => {
        await copyAssets(options, context);
        await copyPackageJson(
          {
            ...options,
            // koine tweak
            // generateExportsField: true,
            generateExportsField: false,
            skipTypings: !options.skipTypeCheck,
            extraDependencies: swcHelperDependency ? [swcHelperDependency] : [],
          },
          context
        );

        // koine tweaks
        await treatEsmOutput(options);
        await treatCjsOutput(options);
        await treatRootEntrypoint(options);
        writeJsonFile(options.swcCliOptions.swcrcPath, swcrcOriginalContent);

        removeTmpSwcrc(options.swcCliOptions.swcrcPath);
        postProcessInlinedDependencies(
          options.outputPath,
          options.originalProjectRoot,
          inlineProjectGraph
        );
        handleTermination();
      });
    });
  }
}

function removeTmpSwcrc(swcrcPath: string) {
  if (swcrcPath.includes("tmp/") && swcrcPath.includes(".generated.swcrc")) {
    removeSync(dirname(swcrcPath));
  }
}

export default executor;

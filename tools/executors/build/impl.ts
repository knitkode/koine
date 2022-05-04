import { existsSync, statSync, rmdirSync, unlinkSync, readdirSync } from "fs";
import { basename, dirname, join, relative, resolve } from "path";
import { build } from "tsup";

import {
  ExecutorContext,
  normalizePath,
  ProjectGraph,
  readJsonFile,
  writeJsonFile,
} from "@nrwl/devkit";
import { readCachedProjectGraph } from "@nrwl/workspace/src/core/project-graph";
import { createPackageJson } from "@nrwl/workspace/src/utilities/create-package-json";

// import { BuildExecutorSchema, NormalizedBuildExecutorSchema } from './schema';
export interface BuildExecutorSchema {
  main: string;
  outputPath: string;
  tsConfig: string;
  packageJson: string;
  assets?: any[];
}

export interface NormalizedBuildExecutorSchema extends BuildExecutorSchema {
  root: string;
  sourceRoot: string;
  projectRoot: string;
}

export const watchFileIsExist = (file: string) =>
  new Promise<void>((success, err) => {
    let loopIndex = 0;
    const loop = () => {
      loopIndex++;
      if (existsSync(file)) {
        success();
      } else if (loopIndex === 100) {
        err(`not found file ${file}`);
      } else {
        setTimeout(() => loop(), 100);
      }
    };
    loop();
  });

export function normalizeBuildOptions(
  options: BuildExecutorSchema,
  root: string,
  sourceRoot: string,
  projectRoot: string
): NormalizedBuildExecutorSchema {
  return {
    ...options,
    root,
    sourceRoot,
    projectRoot,
    main: resolve(root, options.main),
    outputPath: resolve(root, options.outputPath),
    tsConfig: resolve(root, options.tsConfig),
  };
}

function getMainFileDirRelativeToProjectRoot(
  main: string,
  projectRoot: string
): string {
  const mainFileDir = dirname(main);
  const relativeDir = normalizePath(relative(projectRoot, mainFileDir));
  return relativeDir === "" ? `./` : `./${relativeDir}/`;
}

export function updatePackageJson(
  main: string,
  outputPath: string,
  projectRoot: string,
  withTypings = true
): void {
  const packageJson = readJsonFile(join(projectRoot, "package.json"));
  if (packageJson.main && packageJson.typings) {
    return;
  }

  const mainFile = basename(main).replace(/\.[tj]s$/, "");
  const relativeMainFileDir = getMainFileDirRelativeToProjectRoot(
    main,
    projectRoot
  );
  const mainJsFile = `${relativeMainFileDir}${mainFile}.js`;
  const typingsFile = `${relativeMainFileDir}${mainFile}.d.ts`;

  packageJson.main = packageJson.main ?? mainJsFile;

  if (withTypings) {
    packageJson.typings = packageJson.typings ?? typingsFile;
  }

  const outputPackageJson = join(outputPath, "package.json");
  writeJsonFile(outputPackageJson, packageJson);
}

export function generatePackageJson(
  projectName: string,
  graph: ProjectGraph,
  options: NormalizedBuildExecutorSchema
) {
  const packageJson = createPackageJson(projectName, graph, options);
  delete packageJson.devDependencies;
  delete packageJson.scripts;
  writeJsonFile(`${options.outputPath}/package.json`, {
    ...packageJson,
    // main: "./index.js",
    // module: "./index.mjs",
    // exports: {
    //   require: "./index.js",
    //   import: "./index.mjs",
    // },
    // types: "./index.d.ts",
  });
}

export async function buildExecutor(
  options: BuildExecutorSchema,
  context: ExecutorContext
) {
  const { main, outputPath, tsConfig } = options;

  const { sourceRoot, root } = context.workspace.projects[context.projectName!];
  if (!sourceRoot) {
    throw new Error(`${context.projectName} does not have a sourceRoot.`);
  }
  if (!root) {
    throw new Error(`${context.projectName} does not have a root.`);
  }

  const opt = normalizeBuildOptions(options, context.root, sourceRoot, root);
  const projGraph = readCachedProjectGraph();

  // const firstLevelFiles = readdirSync(sourceRoot)
  //   .filter((filename) => filename.endsWith(".ts"))
  //   .filter((filename) => !filename.endsWith(".d.ts"))
  //   .map((filename) => join(sourceRoot, filename));

  // 清空 outputPath
  try {
    const stat = statSync(opt.outputPath);
    if (stat.isDirectory()) {
      rmdirSync(opt.outputPath, { recursive: true });
    } else {
      unlinkSync(opt.outputPath);
    }
  } catch (error) {}

  await build({
    // entry: [main],
    entry: [main],//.concat(firstLevelFiles),
    // splitting: false,
    format: ["esm"/* , "esm" */],
    dts: false,
    sourcemap: false,
    outDir: outputPath,
    tsconfig: tsConfig,
    // minify: false,
    legacyOutput: true,
    // minifyIdentifiers: true,
    // replaceNodeEnv: true,
    esbuildOptions(options, ctx) {
      // options.target = "esnext.js";
      // options.define.foo = '"bar"'
      options.absWorkingDir = context.root;
    },
  });

  generatePackageJson(context.projectName!, projGraph, opt);
  // await watchFileIsExist(resolve(outputPath, "index.d.ts"));
  return {
    success: true,
  };
}

export default buildExecutor;

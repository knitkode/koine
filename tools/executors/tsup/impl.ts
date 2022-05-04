import { existsSync, statSync, rmdirSync, unlinkSync } from "fs";
import { resolve } from "path";
import { ExecutorContext, ProjectGraph, writeJsonFile } from "@nrwl/devkit";
import { readCachedProjectGraph } from "@nrwl/workspace/src/core/project-graph";
import { createPackageJson } from "@nrwl/workspace/src/utilities/create-package-json";
import { build } from "tsup";

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
    //   ".": {
    //     require: "./index.js",
    //     import: "./index.mjs",
    //   },
    //   ...entriesFirstLevel.reduce((map, filename) => {
    //     filename = filename.replace(".ts", "");
    //     map[`./${filename}`] = {
    //       require: `./${filename}.js`,
    //       import: `./${filename}.mjs`,
    //     }
    //     return map;
    //   }, {})
    // },
    types: "./index.d.ts",
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
    entry: [main],
    splitting: false,
    format: ["cjs" /* , "esm" */],
    dts: false,
    sourcemap: false,
    outDir: outputPath,
    tsconfig: tsConfig,
    inject: ["./tools/executors/tsup/shims.js"],
    // minify: false,
    // legacyOutput: true,
    // minifyIdentifiers: true,
    // replaceNodeEnv: true,
    esbuildOptions(options, ctx) {
      // options.target = "esnext";
      // options.define.foo = '"bar"'
      // options.absWorkingDir = context.root;
    },
  });

  generatePackageJson(context.projectName!, projGraph, opt);
  // await watchFileIsExist(resolve(outputPath, "index.d.ts"));
  return {
    success: true,
  };
}

export default buildExecutor;

import { join } from "path";
import { type ExecutorContext, logger, readJsonFile } from "@nrwl/devkit";
import { NormalizedExecutorOptions } from "@nrwl/js/src/utils/schema";
import { type DependentBuildableProjectNode } from "@nrwl/workspace/src/utilities/buildable-libs-utils";
import { build, Options as TsupOptions } from "tsup";

export async function* tsupExecutor(
  options: NormalizedExecutorOptions,
  context: ExecutorContext,
  dependencies: DependentBuildableProjectNode[],
  entrypointsDirs: string[]
) {
  const project = context.workspace.projects[context.projectName];
  const sourceRoot = project.sourceRoot;
  const packageJson = readJsonFile(join(options.root, "./package.json"), {});

  const allTsupOptions = createTsupOptions(
    options,
    context,
    packageJson,
    sourceRoot,
    entrypointsDirs
  );

  logger.info(`Bundling ${context.projectName}...`);

  await Promise.all(
    allTsupOptions.map(async (tsupOptions) => {
      await build(tsupOptions);
    })
  );

  return { success: true };
}

// -----------------------------------------------------------------------------

function createTsupOptions(
  options: NormalizedExecutorOptions,
  context: ExecutorContext,
  packageJson: any,
  sourceRoot: string,
  entrypointsDirs: string[] = []
): TsupOptions[] {
  // the empty string is the `main` entrypoint...weird
  const entrypoints = ["", ...entrypointsDirs].map((entrypointDir) => {
    // const parts = entrypointDir.split("/");
    // const name = entrypointDir ? parts[parts.length - 1] : "index";
    // assume all entrypointsDirs come from a `.ts`and not a `.tsx` file FIXME: do this better
    const path = join(sourceRoot, entrypointDir, "./index.*");
    return { dir: entrypointDir, path };
  });
  const formats = ["cjs"];

  const allTsupConfigs = entrypoints.reduce((allTsupConfigs, { dir, path }) => {
    allTsupConfigs = [
      ...allTsupConfigs,
      ...formats.map((format, idx) => {
        return {
          entry: [path],
          format: [format],
          dts: false,
          sourcemap: false,
          outDir: join(options.outputPath, dir, "umd"),
          tsconfig: options.tsConfig,
          minify: true
        } as TsupOptions;
      }),
    ];
    return allTsupConfigs;
  }, []);

  return allTsupConfigs;
}

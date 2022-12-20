import * as rollup from "rollup";
import { getBabelInputPlugin } from "@rollup/plugin-babel";
import { join } from "path";
import { from, of } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { catchError, concatMap, last, scan, tap } from "rxjs/operators";
import * as autoprefixer from "autoprefixer";
import type { ExecutorContext } from "@nrwl/devkit";
import { logger, readJsonFile } from "@nrwl/devkit";
import {
  computeCompilerOptionsPaths,
  DependentBuildableProjectNode,
} from "@nrwl/workspace/src/utilities/buildable-libs-utils";
import resolve from "@rollup/plugin-node-resolve";
import { NormalizedExecutorOptions } from "@nrwl/js/src/utils/schema";
import { swc } from "@nrwl/web/src/executors/rollup/lib/swc-plugin";

// These use require because the ES import isn't correct.
const commonjs = require("@rollup/plugin-commonjs");
const image = require("@rollup/plugin-image");
const json = require("@rollup/plugin-json");
const postcss = require("rollup-plugin-postcss");

const fileExtensions = [".js", ".jsx", ".ts", ".tsx"];

export async function* rollupExecutor(
  options: NormalizedExecutorOptions,
  context: ExecutorContext,
  dependencies: DependentBuildableProjectNode[],
  entrypointsDirs: string[]
) {
  const project = context.workspace.projects[context.projectName];
  const sourceRoot = project.sourceRoot;
  const packageJson = readJsonFile(join(options.root, "./package.json"), {});

  const rollupOptions = createRollupOptions(
    options,
    dependencies,
    context,
    packageJson,
    sourceRoot,
    entrypointsDirs
  );

  logger.info(`Bundling ${context.projectName}...`);

  const start = process.hrtime.bigint();

  return from(rollupOptions)
    .pipe(
      concatMap((opts) =>
        runRollup(opts).pipe(
          catchError((e) => {
            logger.error(`Error during bundle: ${e}`);
            return of({ success: false });
          })
        )
      ),
      scan(
        (acc, result) => {
          if (!acc.success) return acc;
          return result;
        },
        { success: true }
      ),
      last(),
      tap({
        next: (result) => {
          if (result.success) {
            const end = process.hrtime.bigint();
            const duration = `${(Number(end - start) / 1_000_000_000).toFixed(
              2
            )}s`;

            logger.info(`⚡ Done in ${duration}`);
          } else {
            logger.error(`Bundle failed: ${context.projectName}`);
          }
        },
      })
    )
    .toPromise();
}

// -----------------------------------------------------------------------------

function createRollupOptions(
  options: NormalizedExecutorOptions,
  dependencies: DependentBuildableProjectNode[],
  context: ExecutorContext,
  packageJson: any,
  sourceRoot: string,
  entrypointsDirs: string[] = []
): rollup.InputOptions[] {
  // const useBabel = options.compiler === 'babel';
  // const useSwc = options.compiler === 'swc';
  const useBabel = true;
  const useSwc = false;
  // the empty string is the `main` entrypoint...weird
  const entrypoints = ["", ...entrypointsDirs].map((entrypointDir) => {
    // const parts = entrypointDir.split("/");
    // const name = entrypointDir ? parts[parts.length - 1] : "index";
    // assume all entrypointsDirs come from a `.ts`and not a `.tsx` file FIXME: do this better
    const path = join(sourceRoot, entrypointDir, "./index.ts");
    return { dir: entrypointDir, path };
  });
  const formats = ["umd"];

  const rollupConfigs = entrypoints.reduce((rollupConfigs, { dir, path }) => {
    rollupConfigs = [
      ...rollupConfigs,
      ...formats.map((format, idx) => {
        const plugins = [
          image(),
          useBabel &&
            require("rollup-plugin-typescript2")({
              check: true,
              tsconfig: options.tsConfig,
              tsconfigOverride: {
                compilerOptions: {
                  rootDir: context.root,
                  allowJs: false,
                  declaration: true,
                  paths: computeCompilerOptionsPaths(
                    options.tsConfig,
                    dependencies
                  ),
                },
              },
            }),
          useSwc && swc(),
          postcss({
            inject: true,
            extract: true,
            autoModules: true,
            plugins: [autoprefixer],
          }),
          resolve({
            preferBuiltins: true,
            extensions: fileExtensions,
          }),
          useBabel &&
            getBabelInputPlugin({
              // Let's `@nrwl/web/babel` preset know that we are packaging.
              caller: {
                // @ts-ignore
                // Ignoring type checks for caller since we have custom attributes
                isNxPackage: true,
                // Always target esnext and let rollup handle cjs/umd
                supportsStaticESM: true,
                isModern: true,
              },
              cwd: join(context.root, sourceRoot),
              rootMode: "upward",
              babelrc: true,
              extensions: fileExtensions,
              babelHelpers: "bundled",
              skipPreflightCheck: true, // pre-flight check may yield false positives and also slows down the build
              exclude: /node_modules/,
              plugins: [
                require.resolve("babel-plugin-transform-async-to-promises"),
              ].filter(Boolean),
            }),
          commonjs(),
          json(),
        ];

        const globals = { "react/jsx-runtime": "jsxRuntime" };

        const externalPackages = dependencies
          .map((d) => d.name)
          .concat(Object.keys(packageJson.dependencies || {}));

        const rollupConfig = {
          input: path,
          output: {
            globals,
            format,
            dir: join(options.outputPath, dir),
            name: "index", // context.projectName,
            entryFileNames: `[name].${format}.js`,
            chunkFileNames: `[name].${format}.js`,
            // umd doesn't support code-split bundles
            inlineDynamicImports: format === "umd",
          },
          external: (id) =>
            externalPackages.some(
              (name) => id === name || id.startsWith(`${name}/`)
            ),
          plugins,
        };

        return rollupConfig;
      }),
    ];
    return rollupConfigs;
  }, []);

  return rollupConfigs;
}

function runRollup(options: rollup.RollupOptions) {
  return from(rollup.rollup(options)).pipe(
    switchMap((bundle) => {
      const outputOptions = Array.isArray(options.output)
        ? options.output
        : [options.output];
      return from(
        Promise.all(
          (<Array<rollup.OutputOptions>>outputOptions).map((o) =>
            bundle.write(o)
          )
        )
      );
    }),
    map(() => ({ success: true }))
  );
}

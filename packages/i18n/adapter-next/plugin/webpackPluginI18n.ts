import { resolve } from "path";
import type { Compilation, Compiler } from "webpack";
import { debounce } from "@koine/utils";
import { type I18nCompilerOptions, i18nCompiler } from "../../compiler";
import { isInputDataLocal } from "../../compiler/input/data-local";
import { i18nLogger } from "../../compiler/logger";

const PLUGIN_NAME = "I18nWebpackPlugin";

export class I18nWebpackPlugin {
  opts: I18nCompilerOptions;

  constructor(opts: I18nCompilerOptions) {
    this.opts = opts;
  }

  apply(compiler: Compiler) {
    const inputOpt = this.opts.input;
    const inputs = Array.isArray(inputOpt) ? inputOpt : [inputOpt];
    let inputIdx = 0;

    for (const input of inputs) {
      inputIdx++;

      if (!isInputDataLocal(input)) return;

      const pluginName = PLUGIN_NAME + "-" + inputIdx;
      const { cwd = process.cwd(), source } = input;
      const i18nInputFolder = resolve(cwd, source);

      if (compiler.hooks) {
        const addI18nFolderDeps = debounce(
          (compilation: Compilation) => {
            if (!compilation.contextDependencies.has(i18nInputFolder)) {
              compilation.contextDependencies.add(i18nInputFolder);
              i18nLogger.debug(
                "I18nWebpackPlugin:apply, input folder added to context deps",
              );
              // } else {
              //   console.log("i18nCompiler input folder already added to context deps",);
            }
          },
          1000,
          true,
        );

        compiler.hooks.thisCompilation.tap(pluginName, addI18nFolderDeps);

        const maybeRunI18n = debounce(
          async (compiler: Compiler, callback: () => void) => {
            const isI18nInputFile =
              compiler.modifiedFiles?.has(i18nInputFolder);
            if (isI18nInputFile) {
              i18nLogger.debug(
                "found a change in input folder, it should compile",
              );
              try {
                await i18nCompiler(this.opts);
              } catch (_e) {
                i18nLogger.debug("compilation failed");
              }
            }

            callback();
          },
          100,
          true,
        );

        compiler.hooks.watchRun.tapAsync(pluginName, maybeRunI18n);
      } else {
        // compiler.plugin('done', done);
      }
    }
  }
}

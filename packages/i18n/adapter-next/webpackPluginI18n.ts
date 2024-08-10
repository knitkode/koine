import { resolve } from "path";
import type { Compilation, Compiler } from "webpack";
import { debounce, isAbsoluteUrl } from "@koine/utils";
import { type I18nCompilerOptions, i18nCompiler } from "../compiler";

const PLUGIN_NAME = "I18nWebpackPlugin";

export class I18nWebpackPlugin {
  opts: I18nCompilerOptions;

  constructor(opts: I18nCompilerOptions) {
    this.opts = opts;
  }

  apply(compiler: Compiler) {
    const { debug, input } = this.opts;
    const { cwd = process.cwd(), source } = input;

    if (isAbsoluteUrl(source)) return;

    const i18nInputFolder = resolve(cwd, source);

    if (compiler.hooks) {
      const addI18nFolderDeps = debounce(
        (compilation: Compilation) => {
          // const logger = compilation.getLogger(PLUGIN_NAME);
          if (!compilation.contextDependencies.has(i18nInputFolder)) {
            compilation.contextDependencies.add(i18nInputFolder);
            if (debug === "internal") {
              console.log(
                "[@koine/i18n]:I18nWebpackPlugin:apply, input folder added to context deps",
              );
            }
            // } else {
            //   console.log("i18nCompiler input folder already added to context deps",);
          }
        },
        1000,
        true,
      );

      compiler.hooks.thisCompilation.tap(PLUGIN_NAME, addI18nFolderDeps);

      const maybeRunI18n = debounce(
        async (compiler: Compiler, callback: () => void) => {
          const isI18nInputFile = compiler.modifiedFiles?.has(i18nInputFolder);
          if (isI18nInputFile) {
            // console.log("i18nCompiler should compile now.");
            try {
              await i18nCompiler(this.opts);
            } catch (_e) {
              // console.log("i18nCompiler failed to compile.");
            }
          }

          callback();
        },
        100,
        true,
      );

      compiler.hooks.watchRun.tapAsync(PLUGIN_NAME, maybeRunI18n);
    } else {
      // compiler.plugin('done', done);
    }
  }
}

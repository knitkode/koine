import type { Compilation, Compiler } from "webpack";
import { type I18nCompilerOptions, i18nCompiler } from "../compiler";

const PLUGIN_NAME = "I18nWebpackPlugin";

export class I18nWebpackPlugin {
  opts: I18nCompilerOptions;

  constructor(opts: I18nCompilerOptions) {
    this.opts = opts;
    // console.log("plugin init");
  }

  apply(compiler: Compiler) {
    // console.log("plugin apply", !!compiler.hooks);
    if (compiler.hooks) {
      // // https://webpack.js.org/api/compiler-hooks/
      compiler.hooks.beforeCompile.tapPromise(
        PLUGIN_NAME,
        async (compilation: Compilation, callback: () => void) => {
          // console.log("This is an example plugin!");

          await i18nCompiler(this.opts);

          // await new Promise();
          console.log("done async!!!!!!!!!!!!!!!!!!!!!!!", this.opts);
          callback();
        },
      );
    } else {
      // compiler.plugin('done', done);
    }
  }
}

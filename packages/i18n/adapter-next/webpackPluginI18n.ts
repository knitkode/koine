import type { Compilation, Compiler } from "webpack";
import { type I18nCodegen, i18nCodegen } from "../codegen";

const PLUGIN_NAME = "I18nWebpackPlugin";

export class I18nWebpackPlugin {
  opts: I18nCodegen.OptionalConfig;

  constructor(opts: I18nCodegen.OptionalConfig) {
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

          const codegen = i18nCodegen(this.opts);

          await codegen.write.source({
            adapter: "next",
            output: "i18n",
            skipTsCompile: true,
            skipTranslations: true,
          });

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

import type { PlainObject } from "@koine/utils";
import type { UnionToIntersection } from "@koine/utils";
import type { I18nCompiler } from "./types";

export function createAdapter<
  TName extends I18nCompiler.AdapterName,
  TGenerators extends I18nCompiler.AdapterGenerator<I18nCompiler.AdapterName>[],
  // TGenerators extends I18nCompiler.AdapterGenerator<TName>[],
  TGetGenerators extends (
    // data: I18nCompiler.DataCode<I18nCompiler.AdapterName>
    data: I18nCompiler.DataCode<TName>,
  ) => TGenerators,
  // | Promise<I18nCompiler.AdapterGenerator<TName>[]>;
  TOptions extends PlainObject,
>(config: {
  name: TName;
  defaultOptions: TOptions;
  getMeta: (
    options: I18nCompiler.AdapterConfigurationResolved<TName>["options"],
  ) => I18nCompiler.AdapterConfigurationResolved<TName>["meta"];
  getGenerators: TGetGenerators;
  /**
   * Create adapter's generated files transformers functions to apply in a second pass
   * A file id can be set to `false` to disable its generation.
   */
  getTransformers: (data: I18nCompiler.DataCode<TName>) => Partial<{
    [FileId in keyof UnionToIntersection<
      ReturnType<ReturnType<typeof config.getGenerators>[number]>
    >]:
      | boolean
      | ((
          file: UnionToIntersection<
            ReturnType<ReturnType<typeof config.getGenerators>[number]>
          >[FileId],
        ) => I18nCompiler.AdapterFile);
  }>;
  // tranformFile?: <
  //   TFileId extends keyof UnionToIntersection<ReturnType<ReturnType<typeof config.getGenerators>[number]>>,
  //   TFile extends UnionToIntersection<ReturnType<ReturnType<typeof config.getGenerators>[number]>>[TFileId]
  // >(
  //   fileId: TFileId,
  //   file: TFile,
  // ) => I18nCompiler.AdapterFile;
}) {
  function adapter(data: I18nCompiler.DataCode<TName>) {
    // reverse the order so that one adapter can override its parent adapter's
    // generators
    const generators = config.getGenerators(data).reverse();
    const transformers = config.getTransformers(data);
    // const files = generators.reduce(
    //   (all, generator) => {
    //     all = { ...all, ...generator(data) };
    //     return all;
    //   },
    //   {} as UnionToIntersection<
    //     ReturnType<ReturnType<typeof config.getGenerators>[number]>
    //   >,
    // );

    return {
      generators,
      /**
       * Adapter's files transformers functions to apply in a second pass
       * A file id can be set to `false` to disable its generation.
       */
      transformers,
      // files,
    };
  }

  // TODO: this assertion is not type safe, is just a workaround that allows us
  // to easily re-use other adapters' generators within a getGenerators function
  // but the data argument passed to this function is problematic
  adapter.getGenerators = config.getGenerators as <
    TAdapterName extends I18nCompiler.AdapterName,
  >(
    data: I18nCompiler.DataCode<TAdapterName>,
  ) => I18nCompiler.AdapterGenerator<I18nCompiler.AdapterName>[];
  adapter.getMeta = config.getMeta as <
    TAdapterName extends I18nCompiler.AdapterName,
  >(
    options: I18nCompiler.AdapterConfigurationResolved<TAdapterName>["options"],
  ) => I18nCompiler.AdapterConfigurationResolved<I18nCompiler.AdapterName>["meta"];
  adapter.defaultOptions = config.defaultOptions;

  return adapter;
}

export function createGenerator<
  TName extends I18nCompiler.AdapterName,
  TResult extends I18nCompiler.AdapterGeneratorResult,
>(_name: TName, generator: (data: I18nCompiler.DataCode<TName>) => TResult) {
  return generator;
}

/**
 * Dictionary of the used code generator **directories** names
 */
createGenerator.dirs = {
  internal: "internal",
  server: "server",
  test: "test",
};

/**
 * Prints a `console.log` statement based on the current `logLevel` configuration
 *
 * @param options The _argument_ passed to the `createGenerator` function creator
 * @param generatorName The generator name
 * @param fnName The function name where the loggin happes
 * @param args Whatever you would pass to `console.log`, everyhing will be printed unquoted, so if you intend to log a literal string double quote it like `"'myString'"`
 * @returns An empty string or the `console.log` statement preceded by `\n`
 */
createGenerator.log = (
  options: { config: Pick<I18nCompiler.Config, "logLevel"> },
  generatorName: string,
  fnName: string,
  ...args: unknown[]
) => {
  return options.config.logLevel > 3
    ? `\nif (process.env.NODE_ENV === "development") ` +
        `i18nConsole.log.first(\`${generatorName}${fnName ? "~" + fnName : ""}:\`, ${args.join(", ")})`
    : // `console.log(\`[i18n] ${generatorName}~${fnName}:\`, ${args.join(", ")});`
      "";
};

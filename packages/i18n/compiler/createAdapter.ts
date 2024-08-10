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
  getGenerators: TGetGenerators;
  /**
   * Create adapter's generated files transformers functions to apply in a second pass
   * A file id can be set to `false` to disable its generation.
   */
  getTransformers: (data: I18nCompiler.DataCode<TName>) => Partial<{
    [FileId in keyof UnionToIntersection<
      ReturnType<ReturnType<typeof config.getGenerators>[number]>
    >]:
      | false
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

  adapter.getGenerators = config.getGenerators;
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

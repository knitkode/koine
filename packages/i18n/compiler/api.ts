import { type PartialDeep, type SetOptional, mergeObjects } from "@koine/utils";
import {
  type CodeDataOptions,
  type CodeWriteOptions,
  codeDataOptions,
  getCodeData,
  writeCode,
} from "./code";
import { getConfig } from "./config";
import {
  type InputDataOptions,
  type InputWriteOptions,
  getInputData,
  inputDataOptions,
  writeInput,
} from "./input";
import {
  type SummaryDataOptions,
  type SummaryWriteOptions,
  getSummaryData,
  summaryDataOptions,
  writeSummary,
} from "./summary";
import type { I18nCompiler } from "./types";

const getOptions = (
  config: I18nCompiler.Config,
  {
    input,
    code,
    summary,
  }: {
    input?: PartialDeep<InputDataOptions>;
    code?: PartialDeep<CodeDataOptions>;
    summary?: PartialDeep<SummaryDataOptions>;
  },
) => ({
  config,
  input: mergeObjects({ ...inputDataOptions }, input || {}),
  code: mergeObjects({ ...codeDataOptions }, (code as CodeDataOptions) || {}),
  summary: mergeObjects({ ...summaryDataOptions }, summary || {}),
});

export type I18nCompilerOptions = PartialDeep<ReturnType<typeof getOptions>>;

/**
 * i18nCompiler public api
 *
 * @public
 */
export let i18nCompiler = (compilerOptions: I18nCompilerOptions) => {
  return {
    writeAll: async ({
      code: codeWriteOptions,
      input: inputWriteOptions,
      summary: summaryWriteOptions,
    }: {
      code?: SetOptional<CodeWriteOptions, "config" | "data">;
      input?: SetOptional<InputWriteOptions, "data">;
      summary?: SetOptional<SummaryWriteOptions, "data">;
    }) => {
      const writables = [] as Promise<unknown>[];
      const input = await getInputData(compilerOptions.input);
      const config = getConfig(input, compilerOptions.config);
      const opts = getOptions(config, compilerOptions);

      if (codeWriteOptions) {
        const code = await getCodeData(config, opts.code, input);
        writables.push(
          writeCode({
            config: { ...config, code: opts.code },
            data: { code, input },
            ...codeWriteOptions,
          }),
        );
      }
      if (inputWriteOptions) {
        writables.push(writeInput({ data: input, ...inputWriteOptions }));
      }
      if (summaryWriteOptions) {
        const summary = await getSummaryData(config, opts.summary, input);
        writables.push(writeSummary({ data: summary, ...summaryWriteOptions }));
      }

      return await Promise.all(writables);
    },
    writeCode: async (
      options: SetOptional<CodeWriteOptions, "config" | "data">,
    ) => {
      const input = await getInputData(compilerOptions.input);
      const config = getConfig(input, compilerOptions.config);
      const opts = getOptions(config, compilerOptions);
      const code = await getCodeData(config, opts.code, input);

      return await writeCode({
        config: {
          ...config,
          code: opts.code,
        },
        data: { input, code },
        ...options,
      });
    },
    writeInput: async (options: SetOptional<InputWriteOptions, "data">) => {
      const input = await getInputData(compilerOptions.input);

      return await writeInput({ data: input, ...options });
    },
    writeSummary: async (options: SetOptional<SummaryWriteOptions, "data">) => {
      const input = await getInputData(compilerOptions.input);
      const config = getConfig(input, compilerOptions.config);
      const opts = getOptions(config, compilerOptions);
      const summary = await getSummaryData(config, opts.summary, input);

      return await writeSummary({ data: summary, ...options });
    },
  };
};

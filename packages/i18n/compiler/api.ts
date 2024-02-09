import { type PartialDeep } from "@koine/utils";
import {
  type CodeDataOptions,
  type CodeGenerateOptions,
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
  writeInput,
} from "./input";
import {
  type SummaryDataOptions,
  type SummaryGenerateOptions,
  type SummaryWriteOptions,
  getSummaryData,
  writeSummary,
} from "./summary";
import type { I18nCompiler } from "./types";

type CodeOptions = PartialDeep<CodeDataOptions> &
  CodeGenerateOptions & {
    write?: CodeWriteOptions;
  };

type InputOptions = PartialDeep<InputDataOptions> & {
  write?: InputWriteOptions;
};

type SummaryOptions = SummaryDataOptions &
  SummaryGenerateOptions & {
    write?: SummaryWriteOptions;
  };

export type I18nCompilerOptions = Partial<I18nCompiler.Config> & {
  code?: CodeOptions;
  input?: InputOptions;
  summary?: SummaryOptions;
};

/**
 * i18nCompiler public api
 *
 * @public
 */
export let i18nCompiler = async (options: I18nCompilerOptions) => {
  const writables = [] as Promise<unknown>[];
  const dataInput = await getInputData(options.input);
  const config = getConfig(dataInput, options);
  const {
    code: codeOptions,
    input: inputOptions,
    summary: summaryOptions,
  } = options;

  if (codeOptions?.write) {
    const dataCode = await getCodeData(config, codeDataOptions, dataInput);
    writables.push(
      writeCode(
        { ...codeOptions, ...codeOptions.write },
        { ...config, code: codeDataOptions },
        { code: dataCode, input: dataInput },
      ),
    );
  }
  if (inputOptions?.write) {
    writables.push(writeInput(inputOptions.write, dataInput));
  }
  if (summaryOptions?.write) {
    const dataSummary = await getSummaryData(config, summaryOptions, dataInput);
    writables.push(
      writeSummary(
        {
          ...summaryOptions.write,
          sourceUrl: summaryOptions.sourceUrl,
        },
        dataSummary,
      ),
    );
  }

  return await Promise.all(writables);
};

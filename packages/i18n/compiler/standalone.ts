import { type PartialDeep, objectMergeWithDefaults } from "@koine/utils";
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
  writeInput,
} from "./input";
import {
  type SummaryDataOptions,
  type SummaryWriteOptions,
  getSummaryData,
  writeSummary,
} from "./summary";
import type { I18nCompiler } from "./types";

type CodeOptions = PartialDeep<CodeDataOptions> & {
  write?: Omit<CodeWriteOptions, "config" | "data">;
};

type InputOptions = PartialDeep<InputDataOptions> & {
  write?: Omit<InputWriteOptions, "data">;
};

type SummaryOptions = SummaryDataOptions & {
  write?: Omit<SummaryWriteOptions, "data">;
};

export type I18nStandaloneOptions = PartialDeep<I18nCompiler.Config> & {
  code?: CodeOptions;
  input?: InputOptions;
  summary?: SummaryOptions;
};

/**
 * i18nStandalone public api
 *
 * @public
 */
export let i18nStandalone = (options: I18nStandaloneOptions) => async () => {
  const writables = [] as Promise<unknown>[];
  const dataInput = await getInputData(options.input);
  const config = getConfig(dataInput, options);
  const { code, input, summary } = options;
  const optionsCodeWrite = code?.write;

  if (optionsCodeWrite) {
    const optionsCode = objectMergeWithDefaults(codeDataOptions, code);
    const dataCode = await getCodeData(config, optionsCode, dataInput);
    writables.push(
      writeCode({
        config: { ...config, code: optionsCode },
        data: { code: dataCode, input: dataInput },
        ...optionsCodeWrite,
      }),
    );
  }
  if (input?.write) {
    writables.push(writeInput({ data: dataInput, ...input.write }));
  }
  if (summary?.write) {
    const dataSummary = await getSummaryData(config, summary, dataInput);
    writables.push(writeSummary({ data: dataSummary, ...summary.write }));
  }

  return await Promise.all(writables);
};

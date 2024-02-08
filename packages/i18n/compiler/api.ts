// import type { I18n } from "../types";
import type { SetOptional } from "@koine/utils";
import { type CodeWriteOptions, getCodeData, writeCode } from "./code";
import { getConfig } from "./config";
import { type InputWriteOptions, getInputData, writeInput } from "./input";
import {
  type SummaryWriteOptions,
  getSummaryData,
  writeSummary,
} from "./summary";
import type { I18nCompiler } from "./types";

/**
 * i18nCompiler public api
 *
 * @public
 */
export let i18nCompiler = (instanceOptions: I18nCompiler.OptionalConfig) => {
  return {
    writeAll: async ({
      code: codeOptions,
      input: inputOptions,
      summary: summaryOptions,
    }: {
      code?: SetOptional<CodeWriteOptions, "config" | "data">;
      input?: SetOptional<InputWriteOptions, "data">;
      summary?: SetOptional<SummaryWriteOptions, "data">;
    }) => {
      const writables = [] as Promise<unknown>[];
      const input = await getInputData(instanceOptions.input);
      const config = getConfig(instanceOptions, input);

      if (codeOptions) {
        const code = await getCodeData(config, config.code, input);
        writables.push(
          writeCode({ config, data: { code, input }, ...codeOptions }),
        );
      }
      if (inputOptions) {
        writables.push(writeInput({ data: input, ...inputOptions }));
      }
      if (summaryOptions) {
        const summary = await getSummaryData(config, config.summary, input);
        writables.push(writeSummary({ data: summary, ...summaryOptions }));
      }

      return await Promise.all(writables);
    },
    writeCode: async (
      options: SetOptional<CodeWriteOptions, "config" | "data">,
    ) => {
      const input = await getInputData(instanceOptions.input);
      const config = getConfig(instanceOptions, input);
      const code = await getCodeData(config, config.code, input);

      return await writeCode({ config, data: { input, code }, ...options });
    },
    writeInput: async (options: SetOptional<InputWriteOptions, "data">) => {
      const input = await getInputData(instanceOptions.input);

      return await writeInput({ data: input, ...options });
    },
    writeSummary: async (options: SetOptional<SummaryWriteOptions, "data">) => {
      const input = await getInputData(instanceOptions.input);
      const config = getConfig(instanceOptions, input);
      const summary = await getSummaryData(config, options, input);

      return await writeSummary({ data: summary, ...options });
    },
  };
};

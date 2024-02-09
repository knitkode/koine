import { join } from "node:path";
import { fsWrite } from "@koine/node";
import type { I18nCompiler } from "../types";
import { type SummaryGenerateOptions, generateSummary } from "./generate";

export type SummaryWriteOptions = {
  /**
   * @default process.cwd()
   */
  cwd?: string;
  /**
   * Relative to the given `cwd`.
   */
  outputJson?: string;
  /**
   * Relative to the given `cwd`.
   */
  outputMarkdown?: string;
  /**
   * @default undefined
   */
  pretty?: boolean;
};

export let writeSummary = async (
  options: SummaryWriteOptions & SummaryGenerateOptions,
  data: I18nCompiler.DataSummary,
) => {
  const {
    cwd = process.cwd(),
    outputJson,
    outputMarkdown,
    pretty,
    ...generateOptions
  } = options;
  if (outputJson || outputMarkdown) {
    if (outputJson) {
      await fsWrite(
        join(cwd, outputJson),
        pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data),
      );
    }
    if (outputMarkdown) {
      const markdown = await generateSummary(data, generateOptions);
      await fsWrite(join(cwd, outputMarkdown), markdown);
    }
  }

  return data;
};

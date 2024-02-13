import { join } from "node:path";
import { fsWrite, fsWriteSync } from "@koine/node";
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

const getWriteSummaryJsonArgs = (
  options: Pick<SummaryWriteOptions, "pretty">,
  data: I18nCompiler.DataSummary,
  cwd: string,
  outputJson: string,
) =>
  [
    join(cwd, outputJson),
    options.pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data),
  ] as const;

const getWriteSummaryMdArgs = (
  options: SummaryGenerateOptions,
  data: I18nCompiler.DataSummary,
  cwd: string,
  outputMarkdown: string,
) => [join(cwd, outputMarkdown), generateSummary(data, options)] as const;

export let writeSummary = async (
  options: SummaryWriteOptions & SummaryGenerateOptions,
  data: I18nCompiler.DataSummary,
) => {
  const { cwd = process.cwd(), outputJson, outputMarkdown, ...rest } = options;
  if (outputJson) {
    await fsWrite(...getWriteSummaryJsonArgs(options, data, cwd, outputJson));
  }
  if (outputMarkdown) {
    await fsWrite(...getWriteSummaryMdArgs(rest, data, cwd, outputMarkdown));
  }

  return data;
};

export let writeSummarySync = (
  options: SummaryWriteOptions & SummaryGenerateOptions,
  data: I18nCompiler.DataSummary,
) => {
  const { cwd = process.cwd(), outputJson, outputMarkdown, ...rest } = options;
  if (outputJson) {
    fsWriteSync(...getWriteSummaryJsonArgs(options, data, cwd, outputJson));
  }
  if (outputMarkdown) {
    fsWriteSync(...getWriteSummaryMdArgs(rest, data, cwd, outputMarkdown));
  }

  return data;
};

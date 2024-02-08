import { join } from "node:path";
import { fsWrite } from "@koine/node";
import type { I18nCompiler } from "../types";
import type { SummaryDataOptions } from "./data";
import { generateSummary } from "./generate";

export type SummaryWriteOptions = {
  /**
   * @default process.cwd()
   */
  cwd?: string;
  /**
   * Relative to the given `cwd`.
   */
  outputJson: string;
  /**
   * Relative to the given `cwd`.
   */
  outputMarkdown: string;
  /**
   * @default undefined
   */
  pretty?: boolean;
  data: I18nCompiler.DataSummary;
} & SummaryDataOptions;

export let writeSummary = async (options: SummaryWriteOptions) => {
  const {
    cwd = process.cwd(),
    outputJson,
    outputMarkdown,
    pretty,
    data,
    ...restOptions
  } = options;
  const summary = await generateSummary(data, restOptions);

  await fsWrite(
    join(cwd, outputJson),
    pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data),
  );
  await fsWrite(join(cwd, outputMarkdown), summary.md);

  return data;
};

import { join } from "node:path";
import { fsWrite } from "@koine/node";
import {
  type I18nCodegenSummaryOptions,
  generateSummary,
} from "./generateSummary";
import type { I18nCodegen } from "./types";

export type WriteSummaryOptions = {
  outputJson: string;
  outputMarkdown: string;
} & I18nCodegenSummaryOptions;

export let writeSummary = async (
  data: I18nCodegen.Data,
  options: WriteSummaryOptions,
) => {
  const { cwd } = data.config.fs;
  const { outputJson, outputMarkdown, ...restOptions } = options;
  const summary = await generateSummary(data, restOptions);

  await fsWrite(join(cwd, outputJson), JSON.stringify(summary.data, null, 2));
  await fsWrite(join(cwd, outputMarkdown), summary.md);

  return data;
};

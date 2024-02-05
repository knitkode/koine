import { join } from "node:path";
import { fsWrite } from "@koine/node";
import {
  type I18nCodegenSummaryConfig,
  generateSummary,
} from "./generateSummary";
import { getData } from "./getData";

export type WriteSummaryOptions = {
  cwd: string;
  outputJson: string;
  outputMarkdown: string;
} & I18nCodegenSummaryConfig;

export let writeSummary = async (options: WriteSummaryOptions) => {
  const { cwd, outputJson, outputMarkdown, sourceUrl } = options;

  const data = await getData(options);
  const summary = await generateSummary({ ...data, sourceUrl });

  await fsWrite(join(cwd, outputJson), JSON.stringify(summary.data, null, 2));
  await fsWrite(join(cwd, outputMarkdown), summary.md);

  return data;
};

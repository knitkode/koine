import { join } from "node:path";
import { fsWrite } from "@koine/node";
import {
  type I18nGenerateSummaryConfig,
  generateSummary,
} from "./generateSummary";
import { getFsData } from "./getFsData";

export type WriteSummaryOptions = {
  cwd: string;
  outputJson: string;
  outputMarkdown: string;
} & I18nGenerateSummaryConfig;

export async function writeSummary(options: WriteSummaryOptions) {
  const { cwd, outputJson, outputMarkdown, sourceUrl } = options;

  const data = await getFsData(options);
  const summary = await generateSummary({ ...data, sourceUrl });

  await fsWrite(join(cwd, outputJson), JSON.stringify(summary.data, null, 2));
  await fsWrite(join(cwd, outputMarkdown), summary.md);

  return data;
}

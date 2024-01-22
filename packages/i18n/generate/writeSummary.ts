import { join } from "node:path";
import { fsWrite } from "@koine/node";
import {
  type I18nGenerateSummaryConfig,
  generateSummary,
} from "./generateSummary";
import { getFsData } from "./getFsData";
import type { I18nLocale } from "./types";

export async function writeSummary(
  options: {
    cwd: string;
    outputJson: string;
    outputMarkdown: string;
  } & I18nGenerateSummaryConfig,
) {
  const { cwd, defaultLocale, outputJson, outputMarkdown, sourceUrl } = options;

  const data = await getFsData({
    cwd,
  });

  const summary = await generateSummary({
    files: data.files,
    defaultLocale: defaultLocale as I18nLocale,
    sourceUrl,
  });

  await fsWrite(join(cwd, outputJson), JSON.stringify(summary.data, null, 2));

  await fsWrite(join(cwd, outputMarkdown), summary.md);

  return data;
}

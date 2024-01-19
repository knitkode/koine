import { join } from "node:path";
import { fsWrite } from "@koine/node";
import {
  type I18nGenerateSummaryConfig,
  i18nGenerateSummary,
} from "./i18nGenerateSummary";
import { i18nGetFsData } from "./i18nGetFsData";

export async function i18nWriteSummary(
  options: {
    cwd: string;
    outputJson: string;
    outputMarkdown: string;
  } & I18nGenerateSummaryConfig,
) {
  const { cwd, defaultLocale, outputJson, outputMarkdown, sourceUrl } = options;

  const data = await i18nGetFsData({
    cwd,
  });

  const summary = await i18nGenerateSummary({
    files: data.files,
    defaultLocale,
    sourceUrl,
  });

  await fsWrite(join(cwd, outputJson), JSON.stringify(summary.data, null, 2));

  await fsWrite(join(cwd, outputMarkdown), summary.md);

  return data;
}

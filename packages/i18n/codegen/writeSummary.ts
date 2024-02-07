import { join } from "node:path";
import { fsWrite } from "@koine/node";
import {
  type I18nCodegenSummaryOptions,
  generateSummary,
} from "./generateSummary";
import { getConfig } from "./getConfig";
import { getDataFs } from "./getDataFs";
import { getDataSummary } from "./getDataSummary";
import type { I18nCodegen } from "./types";

export type WriteSummaryOptions = {
  cwd: string;
  outputJson: string;
  outputMarkdown: string;
  config?: I18nCodegen.OptionalConfig;
  data?: I18nCodegen.DataSummary;
} & I18nCodegenSummaryOptions;

export let writeSummary = async ({
  cwd,
  outputJson,
  outputMarkdown,
  config,
  data,
  ...restOptions
}: WriteSummaryOptions) => {
  if (!data) {
    const dataFs = await getDataFs({ cwd });
    const configSafe = getConfig(config || {}, dataFs);
    data = await getDataSummary(configSafe, dataFs);
  }
  const summary = await generateSummary(data, restOptions);

  await fsWrite(join(cwd, outputJson), JSON.stringify(summary.data, null, 2));
  await fsWrite(join(cwd, outputMarkdown), summary.md);

  return data;
};

import { type I18nCodegenConfigOptions, getConfig } from "./getConfig";
import { getDataFs } from "./getDataFs";
import { getDataSource } from "./getDataSource";
import { getDataSummary } from "./getDataSummary";
import type { I18nCodegen } from "./types";

export type GetDataOptions = I18nCodegenConfigOptions;

export let getData = async (
  options: I18nCodegenConfigOptions,
): Promise<I18nCodegen.Data> => {
  const dataFs = await getDataFs(options.fs);
  const config = getConfig(options, dataFs);

  return {
    config,
    fs: dataFs,
    summary: getDataSummary(config, dataFs),
    source: getDataSource(config, dataFs),
  };
};

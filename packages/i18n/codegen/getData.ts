import { type I18nCodegenConfigOptions, getConfig } from "./getConfig";
import { getDataFs } from "./getDataFs";
import { getDataRoutes } from "./getDataRoutes";
import { getDataSummary } from "./getDataSummary";
import { getDataTranslations } from "./getDataTranslations";
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
    routes: getDataRoutes(config, dataFs),
    translations: getDataTranslations(config, dataFs),
  };
};

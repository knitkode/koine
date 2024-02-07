import {
  dataSourceRoutesConfig,
  getDataSourceRoutes,
} from "./getDataSourceRoutes";
import {
  dataSourceTranslationsConfig,
  getDataSourceTranslations,
} from "./getDataSourceTranslations";
import type { I18nCodegen } from "./types";

export const dataSourceConfig = {
  routes: dataSourceRoutesConfig,
  translations: dataSourceTranslationsConfig,
};

/**
 * Get source data
 */
export let getDataSource = (
  config: I18nCodegen.Config,
  dataFs: I18nCodegen.DataFs,
) => {
  return {
    routes: getDataSourceRoutes(config, dataFs),
    translations: getDataSourceTranslations(config, dataFs),
  };
};

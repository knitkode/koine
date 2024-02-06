// import type { I18n } from "../types";
import { type GetDataOptions, getData } from "./getData";
import type { I18nCodegen } from "./types";
import { type WriteSourceOptions, writeSource } from "./writeSource";
import { type WriteSummaryOptions, writeSummary } from "./writeSummary";

/**
 * I18n Codegen public api
 *
 * @public
 */
export let i18nCodegen = (config: GetDataOptions) => {
  let data: I18nCodegen.Data | undefined;

  const instance = {
    data,
    getData,
    write: {
      all: async ({
        source,
        summary,
      }: {
        source: WriteSourceOptions;
        summary: WriteSummaryOptions;
      }) => {
        data = data || (await getData(config));
        await Promise.all([
          writeSource(data, source),
          writeSummary(data, summary),
        ]);
        return instance;
      },
      source: async (options: WriteSourceOptions) => {
        data = data || (await getData(config));
        await writeSource(data, options);
        return instance;
      },
      summary: async (options: WriteSummaryOptions) => {
        data = data || (await getData(config));
        await writeSummary(data, options);
        return instance;
      },
    },
  };

  return instance;
};

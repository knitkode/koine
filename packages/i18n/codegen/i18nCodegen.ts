// import type { I18n } from "../types";
import { type GetDataOptions, getData } from "./getData";
import type { I18nCodegen } from "./types";
import { type WriteDataOptions, writeData } from "./writeData";
import { type WriteSourceOptions, writeSource } from "./writeSource";
import { type WriteSummaryOptions, writeSummary } from "./writeSummary";

/**
 * I18n Codegen public api
 *
 * @public
 */
export let i18nCodegen = (config: GetDataOptions) => {
  let genData: I18nCodegen.Data | undefined;

  const instance = {
    data: genData,
    getData,
    write: {
      all: async ({
        data,
        source,
        summary,
      }: {
        data: WriteDataOptions;
        source: WriteSourceOptions;
        summary: WriteSummaryOptions;
      }) => {
        genData = genData || (await getData(config));
        await Promise.all([
          writeData(genData, data),
          writeSource(genData, source),
          writeSummary(genData, summary),
        ]);
        return instance;
      },
      data: async (options: WriteDataOptions) => {
        genData = genData || (await getData(config));
        await writeData(genData, options);
        return instance;
      },
      source: async (options: WriteSourceOptions) => {
        genData = genData || (await getData(config));
        await writeSource(genData, options);
        return instance;
      },
      summary: async (options: WriteSummaryOptions) => {
        genData = genData || (await getData(config));
        await writeSummary(genData, options);
        return instance;
      },
    },
  };

  return instance;
};

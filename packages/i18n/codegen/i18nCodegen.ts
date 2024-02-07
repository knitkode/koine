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

  return {
    data: genData,
    getData,
    write: {
      all: async ({
        data: dataOpts,
        source: sourceOpts,
        summary: summaryOpts,
      }: {
        data: WriteDataOptions;
        source: WriteSourceOptions;
        summary: WriteSummaryOptions;
      }) => {
        genData = genData || (await getData(config));
        await Promise.all([
          writeData(dataOpts, genData),
          writeSource(sourceOpts, genData.config, genData.fs, genData.source),
          writeSummary({ ...summaryOpts, data: genData.summary }),
        ]);
      },
      data: async (options: WriteDataOptions) => {
        genData = genData || (await getData(config));
        await writeData(options, genData);
      },
      source: async (options: WriteSourceOptions) => {
        genData = genData || (await getData(config));
        await writeSource(options, genData.config, genData.fs, genData.source);
      },
      summary: async (options: WriteSummaryOptions) => {
        genData = genData || (await getData(config));
        await writeSummary({ ...options, data: genData.summary });
      },
    },
  };
};

import { getConfig } from "./compiler/config";
import { inputDataOptions, writeInput } from "./compiler/input";
import { getInputDataFs } from "./compiler/input/data-fs";
import {
  type SummaryDataOptions,
  getSummaryData,
  writeSummary,
} from "./compiler/summary";

type I18nActionOptions = {
  cwd: string;
  /**
   * Typically the current repo URL read on the `process.env` variables
   *
   * {@link SummaryDataOptions}
   */
  url: SummaryDataOptions["sourceUrl"];
  /**
   * Relative paths to the given `cwd` for the desired output files
   */
  output: {
    input?: string;
    summaryJson?: string;
    summaryMarkdown?: string;
  };
};

export let i18nAction = async (options: I18nActionOptions) => {
  const {
    cwd,
    url,
    output: { input, summaryJson, summaryMarkdown },
  } = options;
  const dataInput = await getInputDataFs({ ...inputDataOptions, cwd });
  const writables: Promise<any>[] = [];

  if (input) {
    writables.push(writeInput({ cwd, output: input }, dataInput));
  }

  if (summaryJson || summaryMarkdown) {
    const summary = getSummaryData(
      getConfig(dataInput),
      { sourceUrl: url },
      dataInput,
    );
    writables.push(
      writeSummary(
        {
          cwd,
          outputJson: summaryJson,
          outputMarkdown: summaryMarkdown,
          sourceUrl: url,
        },
        summary,
      ),
    );
  }

  await Promise.all(writables);

  return dataInput;
};

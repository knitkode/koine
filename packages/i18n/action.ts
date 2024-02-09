import { getConfig } from "./compiler/config";
import {
  type InputDataOptions,
  getInputDataLocal,
  writeInput,
} from "./compiler/input";
// import { type InputDataOptions, writeInput } from "./compiler/input";
// import { getInputDataLocal } from "./compiler/input/data-local";
import {
  type SummaryDataOptions,
  getSummaryData,
  writeSummary,
} from "./compiler/summary";

type I18nActionOptions = Partial<InputDataOptions> & {
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
    // defaults for github action where locales folders are at the root
    source = ".",
    url,
    output: { input, summaryJson, summaryMarkdown },
    ...inputDataOptions
  } = options;
  const dataInput = await getInputDataLocal({
    cwd,
    source,
    ...inputDataOptions,
  });
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

import {
  type CodeDataOptions,
  type CodeWriteOptions,
  getCodeData,
  writeCode, // writeCodeSync,
} from "./code";
import { type I18nCompilerConfig, getConfig } from "./config";
import {
  type InputDataOptions,
  type InputWriteOptions,
  getInputData, // getInputDataSync,
  writeInput, // writeInputSync,
} from "./input";
import {
  type SummaryDataOptions,
  type SummaryWriteOptions,
  getSummaryData,
  writeSummary, // writeSummarySync,
} from "./summary";
import type { I18nCompiler } from "./types";

type InputOptions = InputDataOptions & {
  write?: InputWriteOptions;
};

type CodeOptions = CodeDataOptions & {
  write?: CodeWriteOptions;
};

type SummaryOptions = SummaryDataOptions & {
  write?: SummaryWriteOptions;
};

export type I18nCompilerOptions = I18nCompilerConfig & {
  input: InputOptions;
  code: CodeOptions;
  summary?: SummaryOptions;
};

export type I18nCompilerReturn = Awaited<ReturnType<typeof i18nCompiler>>;

/**
 * i18nCompiler async api
 *
 * @public
 */
export let i18nCompiler = async <
  TAdapterName extends I18nCompiler.AdaptersName,
>(
  options: I18nCompilerOptions,
) => {
  const {
    input: optsInput,
    code: optsCode,
    summary: optsSummary,
    ...configOptions
  } = options;
  const writables = [] as Promise<any>[];
  const input = await getInputData(optsInput);
  const config = getConfig(input, configOptions);
  // it would be easy to make this optional but it's nice to be able to always
  // predictably return data
  const code = getCodeData(config, optsCode, input);

  if (optsInput?.write) {
    writables.push(writeInput(optsInput.write, input));
  }

  if (optsCode?.write) {
    writables.push(writeCode({ ...optsCode, ...optsCode.write }, code));
  }

  if (optsSummary?.write) {
    writables.push(
      writeSummary(
        { ...optsSummary, ...optsSummary.write },
        getSummaryData(config, optsSummary, input),
      ),
    );
  }

  await Promise.all(writables);

  return { config, input, code };
};

// /**
//  * i18nCompiler sync api
//  *
//  * @public
//  */
// export let i18nCompilerSync = (options: I18nCompilerOptions) => {
//   const {
//     input: optsInput,
//     code: optsCode,
//     summary: optsSummary,
//     ...configOptions
//   } = options;
//   const input = getInputDataSync(optsInput);
//   const config = getConfig(input, configOptions);
//   // it would be easy to make this optional but it's nice to be able to always
//   // predictably return data
//   const code = getCodeData(config, optsCode, input);

//   if (optsInput?.write) {
//     writeInputSync(optsInput.write, input);
//   }

//   if (optsCode?.write) {
//     writeCodeSync({ ...optsCode, ...optsCode.write }, code);
//   }

//   if (optsSummary?.write) {
//     writeSummarySync(
//       { ...optsSummary, ...optsSummary.write },
//       getSummaryData(config, optsSummary, input),
//     );
//   }

//   return { config, input, code };
// };

import {
  type CodeDataOptions,
  type CodeWriteOptions,
  getCodeData,
  resolveWriteCodeOptions, // writeCodeSync,
  // getCodeDataSync
  writeCode,
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

type InputOptions = InputDataOptions & {
  /**
   * Options for _input_ writing
   */
  write?: InputWriteOptions;
};

type CodeOptions = CodeDataOptions & {
  /**
   * Options for _code_ writing
   */
  write?: CodeWriteOptions;
};

type SummaryOptions = SummaryDataOptions & {
  /**
   * Options for _summary_ writing
   */
  write?: SummaryWriteOptions;
};

export type I18nCompilerOptions = I18nCompilerConfig & {
  /**
   * Options for _input_ data generation and writing
   */
  input: InputOptions;
  /**
   * Options for _code_ data generation and writing
   */
  code: CodeOptions;
  /**
   * Options for _summary_ data generation and writing
   */
  summary?: SummaryOptions;
};

export type I18nCompilerReturn = Awaited<ReturnType<typeof i18nCompiler>>;

/**
 * i18nCompiler async api
 *
 * @public
 */
export let i18nCompiler = async (options: I18nCompilerOptions) => {
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
  const code = await getCodeData(config, optsCode, input);

  if (optsInput?.write) {
    writables.push(writeInput(optsInput.write, input));
  }

  if (optsCode?.write) {
    const codeWriteOptions = resolveWriteCodeOptions(optsCode.write);
    code.options.write = codeWriteOptions;
    // writables.push(writeCode({ ...optsCode, ...optsCode.write }, code));
    writables.push(writeCode(codeWriteOptions, code));
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
// export let i18nCompilerSync = ( <
//   TAdapterName extends I18nCompiler.AdapterName,
// >(
//   options: I18nCompilerOptions,
// ) => {
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
//   const code = getCodeDataSync(config, optsCode, input);

//   if (optsInput?.write) {
//     writeInputSync(optsInput.write, input);
//   }

//   if (optsCode?.write) {
//     const codeWriteOptions = resolveWriteCodeOptions(optsCode.write);
//     code.options.write = codeWriteOptions;
//     // writeCodeSync({ ...optsCode, ...optsCode.write }, code);
//     writeCodeSync(codeWriteOptions, code);
//   }

//   if (optsSummary?.write) {
//     writeSummarySync(
//       { ...optsSummary, ...optsSummary.write },
//       getSummaryData(config, optsSummary, input),
//     );
//   }

//   return { config, input, code };
// };

import type { StructuredCloneable, TestType } from "@koine/utils";
import {
  type CodeDataOptions,
  type CodeWriteOptions,
  getCodeData,
  getCodeDataSync,
  resolveWriteCodeOptions,
  writeCode,
  writeCodeSync,
} from "./code";
import { type I18nCompilerConfig, getConfig } from "./config";
import {
  type InputDataOptions,
  type InputWriteOptions,
  getInputData,
  getInputDataSync,
  writeInput,
  writeInputSync,
} from "./input";
import {
  type SummaryDataOptions,
  type SummaryWriteOptions,
  getSummaryData,
  writeSummary,
  writeSummarySync,
} from "./summary";

export type I18nCompilerOptions = I18nCompilerConfig & {
  /**
   * Options for _input_ data generation and writing
   */
  input: InputDataOptions & {
    /**
     * Options for _input_ writing
     */
    write?: InputWriteOptions;
  };
  /**
   * Options for _code_ data generation and writing
   */
  code: CodeDataOptions & {
    /**
     * Options for _code_ writing
     */
    write?: CodeWriteOptions;
  };
  /**
   * Options for _summary_ data generation and writing
   */
  summary?: SummaryDataOptions & {
    /**
     * Options for _summary_ writing
     */
    write?: SummaryWriteOptions;
  };
};

export type I18nCompilerReturn = Awaited<ReturnType<typeof i18nCompiler>>;

// NOTE: the result of i18nCompiler must be serializable by Structured Clone
// Algorithm to work with synckit @see https://github.com/un-ts/synckit#api
// So in case we add functions to the options we need to remove them
type _TestReturn = TestType<
  I18nCompilerReturn extends StructuredCloneable ? true : false,
  I18nCompilerReturn & { a: () => "" } extends StructuredCloneable
    ? false
    : true
>;

/**
 * i18nCompiler async api
 *
 * @public
 */
export let i18nCompiler = async (options: I18nCompilerOptions) => {
  /**
   * NOTE: since this is called through `synckit` if we want to exit the running
   * process here, let's say because there is a misconfiguration from the user,
   * and we do not want to throw an error because it looks less understanble
   * from the terminal, we need to use `process.kill(process.pid);`
   */
  const {
    input: optsInput,
    code: optsCode,
    summary: optsSummary,
    ...configOptions
  } = options;
  const writables = [] as Promise<any>[];
  const input = await getInputData(optsInput);
  const config = getConfig(input, configOptions);
  const code = await getCodeData(config, optsCode, input);

  if (optsInput?.write) {
    writables.push(writeInput(optsInput.write, input));
  }

  if (optsCode?.write) {
    const codeWriteOptions = resolveWriteCodeOptions(optsCode.write);
    code.options.write = codeWriteOptions;
    writables.push(writeCode(config, codeWriteOptions, code));
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

  return code;
};

/**
 * i18nCompiler sync api
 *
 * @public
 */
// NOTE: do not export the sync version as the automatic syncing done by
// synckit seem to work well and it allows for features parity between
// sync/async version of the compiler. The sync implementation is still being
// kept and developed to avoid vendor lock-in in case synckit would stop
// working
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let i18nCompilerSync = (options: I18nCompilerOptions) => {
  const {
    input: optsInput,
    code: optsCode,
    summary: optsSummary,
    ...configOptions
  } = options;
  const input = getInputDataSync(optsInput);
  const config = getConfig(input, configOptions);
  const code = getCodeDataSync(config, optsCode, input);

  if (optsInput?.write) {
    writeInputSync(optsInput.write, input);
  }

  if (optsCode?.write) {
    const codeWriteOptions = resolveWriteCodeOptions(optsCode.write);
    code.options.write = codeWriteOptions;
    writeCodeSync(config, codeWriteOptions, code);
  }

  if (optsSummary?.write) {
    writeSummarySync(
      { ...optsSummary, ...optsSummary.write },
      getSummaryData(config, optsSummary, input),
    );
  }

  return code;
};

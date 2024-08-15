import type { LiteralUnion } from "@koine/utils";
import type { I18nCompiler } from "../types";

/**
 * Any of the input data options supported:
 *
 * - {@link InputDataOptionsDirect}
 * - {@link InputDataOptionsLocal}
 * - {@link InputDataOptionsRemote}
 */
export type InputDataOptions =
  | InputDataOptionsDirect
  | InputDataOptionsLocal
  | InputDataOptionsRemote;

export type InputDataOptionsDirect = {
  /**
   * ## Input Source
   *
   * There are three "strategies":
   * NB: Often this is based on the current environment
   *
   * ### Direct
   *
   * You can directly pass source data or a function (sync or async) returning it.
   *
   * Data should come already formatted correctly as {@link I18nCompiler.DataInput}.
   */
  source:
    | I18nCompiler.DataInput
    | (() => I18nCompiler.DataInput)
    | (() => Promise<I18nCompiler.DataInput>);
};

export type InputDataOptionsLocal = {
  /**
   * ### Local
   *
   * It should point to the folder containing the i18n input files divided by
   * locale, it can be one of:
   * - relative filesystem path (resolved according to `cwd` option)
   * - absolute filesystem path
   */
  source: LiteralUnion<`.${string}` | `/${string}`, string>;
  /**
   * `source` path that is resolved from this value
   *
   * @default process.cwd()
   */
  cwd?: string;
  /**
   * A list of glob patterns to ignore (checked with `minimatch`)
   *
   * @default []
   */
  ignore?: string[];
  // TODO: think about how and why the watch commented option, we could even
  // implement this for remote source files with a polling mechanism followed
  // by a deep comparison
  // /**
  //  * The watch implementation and the default value of this option varies
  //  * based on the adapter in use and the phase of the bundling/building tool
  //  * in use in your project.
  //  *
  //  * Use this option only to forcely override the automatic behaviour, when
  //  * `true` i18n input source files are watch and upon change compiled files
  //  * get re-generated.
  //  */
  // watch?: boolean;
};

export type InputDataOptionsRemote = {
  /**
   * ### Remote
   *
   * It should point to a url containing the i18n input dump, it can be one of:
   * - any absolute URL
   * - github absolute URL (when data is on a separated repo that implements our `knitkode/koine/actions/i18n`)
   */
  source: LiteralUnion<
    // `http${string}` | `${typeof GITHUB_RAW_URL}${string}`,
    `http${string}` | `https://raw.githubusercontent.com${string}`,
    string
  >;
  /**
   * A list of glob patterns to ignore (checked with `minimatch`)
   *
   * @default []
   */
  ignore?: string[];
};

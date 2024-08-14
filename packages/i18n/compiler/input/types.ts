import type { LiteralUnion } from "@koine/utils";

export type InputDataOptions = InputDataSharedOptions &
  InputDataLocalOptions &
  InputDataRemoteOptions;

export type InputDataSharedOptions = {
  /**
   * It should point to the folder or to JSON file url containing the i18n input
   * files divided by locale.
   *
   * Usually this is based on the current environment, it can be one of:
   *
   * - relative filesystem path (resolved according to `cwd` option)
   * - absolute filesystem path
   * - absolute URL
   * - github absolute URL (when data is on a separated repo that implements our `knitkode/koine/actions/i18n`)
   */
  source: InputDataLocalSource | InputDataRemoteSource;
  /**
   * A list of glob patterns to ignore (checked with `minimatch`)
   *
   * @default []
   */
  ignore?: string[];
};

export type InputDataRemoteSource = LiteralUnion<
  // `http${string}` | `${typeof GITHUB_RAW_URL}${string}`,
  `http${string}` | `https://raw.githubusercontent.com${string}`,
  string
>;

export type InputDataRemoteOptions = Pick<
  InputDataSharedOptions,
  "ignore"
> & {};

export type InputDataLocalSource = LiteralUnion<
  `.${string}` | `/${string}`,
  string
>;

export type InputDataLocalOptions = Pick<InputDataSharedOptions, "ignore"> & {
  /**
   * When `source` {@link InputDataSharedOptions} is a filesystem path that is resolved from this value
   *
   * @default process.cwd()
   */
  cwd?: string;
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

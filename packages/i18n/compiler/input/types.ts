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
};

export type InputDataRemoteSource = LiteralUnion<
  // `http${string}` | `${typeof GITHUB_RAW_URL}${string}`,
  `http${string}` | `https://raw.githubusercontent.com${string}`,
  string
>;

export type InputDataRemoteOptions = {
  /**
   * Optionally pass a list of glob patterns to ignore (checked with `minimatch`)
   */
  ignore?: string[];
};

export type InputDataLocalSource = LiteralUnion<
  `.${string}` | `/${string}`,
  string
>;

export type InputDataLocalOptions = {
  /**
   * When `source` is a filesystem path that is resolved from this value
   *
   * @default process.cwd()
   */
  cwd?: string;
  /**
   * Optionally pass a list of glob patterns to ignore (checked with `minimatch`)
   */
  ignore?: string[];
};

import { isAbsoluteUrl } from "next/dist/shared/lib/utils";
import type { I18nCompiler } from "../types";
import {
  type InputDataLocalOptions,
  type InputDataLocalSource,
  getInputDataLocal,
  getInputDataLocalSync,
} from "./data-local";
import {
  type InputDataRemoteOptions,
  type InputDataRemoteSource,
  getInputDataRemote,
  getInputDataRemoteSync,
} from "./data-remote";

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

export type InputDataOptions = InputDataSharedOptions &
  InputDataLocalOptions &
  InputDataRemoteOptions;

export let getInputData = async (
  options: InputDataOptions,
): Promise<I18nCompiler.DataInput> => {
  const { source } = options;

  if (isAbsoluteUrl(source)) {
    return await getInputDataRemote(options);
  }
  return await getInputDataLocal(options);
};

export let getInputDataSync = (
  options: InputDataOptions,
): I18nCompiler.DataInput => {
  const { source } = options;

  if (isAbsoluteUrl(source)) {
    return getInputDataRemoteSync(options);
  }
  return getInputDataLocalSync(options);
};

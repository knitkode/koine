import type { I18nCompiler } from "../types";
import {
  getInputDataDirect,
  getInputDataDirectSync,
  isInputDataDirect,
} from "./data-direct";
import {
  getInputDataLocal,
  getInputDataLocalSync,
  isInputDataLocal,
} from "./data-local";
import {
  getInputDataRemote,
  getInputDataRemoteSync,
  isInputDataRemote,
} from "./data-remote";
import type { InputDataOptions } from "./types";

export let getInputData = async (
  options: InputDataOptions,
): Promise<I18nCompiler.DataInput> => {
  if (isInputDataDirect(options)) {
    return await getInputDataDirect(options);
  }
  if (isInputDataRemote(options)) {
    return await getInputDataRemote(options);
  }
  if (isInputDataLocal(options)) {
    return await getInputDataLocal(options);
  }
  throw Error(`[@koine/i18n]: Invalid 'source' option`);
};

export let getInputDataSync = (
  options: InputDataOptions,
): I18nCompiler.DataInput => {
  if (isInputDataDirect(options)) {
    return getInputDataDirectSync(options);
  }
  if (isInputDataRemote(options)) {
    return getInputDataRemoteSync(options);
  }
  if (isInputDataLocal(options)) {
    return getInputDataLocalSync(options);
  }
  throw Error(`[@koine/i18n]: Invalid 'source' option`);
};

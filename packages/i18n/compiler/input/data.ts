import { isAbsoluteUrl } from "next/dist/shared/lib/utils";
import type { I18nCompiler } from "../types";
import { getInputDataLocal, getInputDataLocalSync } from "./data-local";
import { getInputDataRemote, getInputDataRemoteSync } from "./data-remote";
import type { InputDataOptions } from "./types";

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

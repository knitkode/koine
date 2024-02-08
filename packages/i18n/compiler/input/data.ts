import { mergeObjects } from "@koine/utils";
import type { I18nCompiler } from "../types";
import { getInputDataFs } from "./data-fs";
import { getInputDataRemote } from "./data-remote";

export const inputDataOptions = {
  cwd: process.cwd(),
  ignore: [] as string[],
  url: "",
};

export type InputDataOptions = typeof inputDataOptions;

export let getInputData = async (
  options?: Partial<InputDataOptions>,
): Promise<I18nCompiler.DataInput> => {
  const config = mergeObjects({ ...inputDataOptions }, options || {});

  if (config.url) {
    return await getInputDataRemote(config);
  }
  return await getInputDataFs(config);
};

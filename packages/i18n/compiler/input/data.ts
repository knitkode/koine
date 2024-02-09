import { objectMergeWithDefaults } from "@koine/utils";
import type { I18nCompiler } from "../types";
import { getInputDataFs } from "./data-fs";
import { getInputDataRemote } from "./data-remote";

type InputDataMode = "fs" | "url" | "github";

export const inputDataOptions = {
  /**
   * TODO: github mode and mode handling in general
   *
   * @default "fs"
   */
  mode: "fs" as InputDataMode,
  /**
   * When `mode` is `"fs"` this should point to the folder containing the
   * i18n input files divided by locale.
   */
  cwd: process.cwd(),
  /**
   * This only works when `"fs"`
   */
  ignore: [] as string[],
  url: "",
};

export type InputDataOptions = typeof inputDataOptions;

export let getInputData = async (
  options?: Partial<InputDataOptions>,
): Promise<I18nCompiler.DataInput> => {
  const config = objectMergeWithDefaults(inputDataOptions, options);
  const { mode, url, cwd } = options || {};
  const computedMode = mode || url ? "url" : cwd ? "fs" : "";

  if (!computedMode) {
    throw new Error("Could not determine how to get input data");
  }
  if (url) {
    return await getInputDataRemote(config);
  }
  return await getInputDataFs(config);
};

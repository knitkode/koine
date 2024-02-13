import { join } from "node:path";
import { fsWrite, fsWriteSync } from "@koine/node";
import type { I18nCompiler } from "../types";

export type InputWriteOptions = {
  /**
   * @default process.cwd()
   */
  cwd?: string;
  output: string;
  /**
   * @default undefined
   */
  pretty?: boolean;
};

const getWriteInputArgs = (
  options: InputWriteOptions,
  data: I18nCompiler.DataInput,
) => {
  const { cwd = process.cwd(), output, pretty } = options;
  return [
    join(cwd, output),
    pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data),
  ] as const;
};

export let writeInput = async (
  options: InputWriteOptions,
  data: I18nCompiler.DataInput,
) => {
  await fsWrite(...getWriteInputArgs(options, data));
};

export let writeInputSync = (
  options: InputWriteOptions,
  data: I18nCompiler.DataInput,
) => {
  fsWriteSync(...getWriteInputArgs(options, data));
};

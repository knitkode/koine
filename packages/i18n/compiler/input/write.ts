import { join } from "node:path";
import { fsWrite } from "@koine/node";
import type { I18nCompiler } from "../types";

export type InputWriteOptions = {
  cwd: string;
  output: string;
  /**
   * @default undefined
   */
  pretty?: boolean;
};

export let writeInput = async (
  options: InputWriteOptions,
  data: I18nCompiler.DataInput,
) => {
  const { cwd, output, pretty } = options;
  await fsWrite(
    join(cwd, output),
    pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data),
  );

  return data;
};

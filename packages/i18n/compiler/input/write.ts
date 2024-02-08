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
  data: I18nCompiler.DataInput;
};

export let writeInput = async (options: InputWriteOptions) => {
  const { cwd, output, pretty, data } = options;
  await fsWrite(
    join(cwd, output),
    pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data),
  );

  return data;
};

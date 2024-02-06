import { join } from "node:path";
import { fsWrite } from "@koine/node";
import type { I18nCodegen } from "./types";

export type WriteDataOptions = {
  output: string;
  /**
   * @default undefined
   */
  pretty?: boolean;
};

export let writeData = async (
  data: I18nCodegen.Data,
  options: WriteDataOptions,
) => {
  const { cwd } = data.config.fs;
  const { output, pretty } = options;

  await fsWrite(
    join(cwd, output),
    pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data),
  );

  return data;
};

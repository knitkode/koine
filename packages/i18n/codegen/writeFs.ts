import { join } from "node:path";
import { fsWrite } from "@koine/node";
import { getDataFs } from "./getDataFs";
import type { I18nCodegen } from "./types";

export type WriteFsOptions = {
  cwd: string;
  output: string;
  /**
   * @default undefined
   */
  pretty?: boolean;
  data?: I18nCodegen.DataFs;
};

export let writeFs = async ({ cwd, output, pretty, data }: WriteFsOptions) => {
  data = data || (await getDataFs({ cwd }));

  await fsWrite(
    join(cwd, output),
    pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data),
  );

  return data;
};

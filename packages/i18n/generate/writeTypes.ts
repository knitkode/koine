import { join } from "node:path";
import { fsWrite } from "@koine/node";
import { generateTypes } from "./generateTypes";
import { getFsData } from "./getFsData";

export async function writeTypes(options: {
  cwd: string;
  defaultLocale: string;
  outputTypes: string;
}) {
  const { cwd, defaultLocale, outputTypes } = options;

  const data = await getFsData({
    cwd,
    onlyFilesForLocales: [defaultLocale],
  });
  const types = await generateTypes({ files: data.files, defaultLocale });

  await fsWrite(join(cwd, outputTypes), types);

  return data;
}

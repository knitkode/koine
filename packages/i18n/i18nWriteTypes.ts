import { join } from "node:path";
import { fsWrite } from "@koine/node";
import { i18nGenerateTypes } from "./i18nGenerateTypes";
import { i18nGetFsData } from "./i18nGetFsData";

export async function i18nWriteTypes(options: {
  cwd: string;
  defaultLocale: string;
  outputTypes: string;
}) {
  const { cwd, defaultLocale, outputTypes } = options;

  const data = await i18nGetFsData({
    cwd,
    onlyFilesForLocales: [defaultLocale],
  });
  const types = await i18nGenerateTypes({ files: data.files, defaultLocale });

  await fsWrite(join(cwd, outputTypes), types);

  return data;
}

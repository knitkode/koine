import { join } from "node:path";
import { fsWrite } from "@koine/node";
import type { I18n } from "../types";
import { I18nGenerateTypesConfig, generateTypes } from "./generateTypes";
import { getFsData } from "./getFsData";

export async function writeTypes(
  options: {
    cwd: string;
    outputTypes: string;
  } & I18nGenerateTypesConfig,
) {
  const { cwd, defaultLocale, outputTypes } = options;

  const data = await getFsData({
    cwd,
    onlyFilesForLocales: [defaultLocale],
  });
  const types = await generateTypes({
    defaultLocale: defaultLocale as I18n.Locale,
    files: data.files,
  });

  await fsWrite(join(cwd, outputTypes), types);

  return data;
}

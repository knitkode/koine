import { join } from "node:path";
import { fsWrite } from "@koine/node";
import type { I18n } from "../types";
import {
  type I18nGenerateRoutesConfig,
  generateRoutes,
} from "./generateRoutes";
import { getFsData } from "./getFsData";

export async function writeRoutes(
  options: {
    cwd: string;
    outputJson: string;
  } & I18nGenerateRoutesConfig,
) {
  const { cwd, outputJson, defaultLocale } = options;

  const data = await getFsData({
    cwd,
  });

  const routes = await generateRoutes({
    defaultLocale: defaultLocale as I18n.Locale,
    files: data.files,
  });

  await fsWrite(join(cwd, outputJson), JSON.stringify(routes.data, null, 2));

  return data;
}

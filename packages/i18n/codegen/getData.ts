import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { glob } from "glob";
import { type I18nCodegenConfigPartial, getConfig } from "./getConfig";
import { getDataRoutes } from "./getDataRoutes";
import { getDataTranslations } from "./getDataTranslations";
import type { I18nCodegen } from "./types";

export type GetDataOptions = I18nCodegenConfigPartial & {
  ignore?: string[];
};

export let getData = async (
  options: GetDataOptions,
): Promise<I18nCodegen.Data> => {
  const config = getConfig(options);
  const files: I18nCodegen.Data["files"] = [];

  await Promise.all(
    config.locales.map(async (locale) => {
      const jsonFiles = await glob("**/*.json", {
        cwd: join(config.fs.cwd, locale),
      });

      await Promise.all(
        jsonFiles.map(async (relativePath) => {
          const fullPath = join(config.fs.cwd, locale, relativePath);
          const rawContent = await readFile(fullPath, "utf8");

          if (rawContent) {
            files.push({
              path: relativePath,
              data: JSON.parse(rawContent),
              locale: locale,
            });
          }
        }),
      );
    }),
  );

  return {
    config,
    files,
    routes: getDataRoutes(config, files),
    translations: getDataTranslations(config, files),
  };
};

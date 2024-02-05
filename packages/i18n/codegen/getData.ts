import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { glob } from "glob";
import { getConfig } from "./getConfig";
import { getDataRoutes } from "./getDataRoutes";
import { getDataTranslations } from "./getDataTranslations";
import { getLocalesFolders } from "./getLocalesFolders";
import type { I18nCodegen } from "./types";

export type GetDataOptions = Partial<I18nCodegen.Config> & {
  cwd: string;
  ignore?: string[];
};

export let getData = async (
  options: GetDataOptions,
): Promise<I18nCodegen.Data> => {
  const { cwd, ignore, ...restConfig } = options;
  const config = getConfig(restConfig);
  const localesFolders = await getLocalesFolders({
    cwd,
    ignore,
    defaultLocale: options.defaultLocale,
  });
  const locales = localesFolders.map((l) => l.code);
  const defaultLocale = options.defaultLocale || locales[0];
  const files: I18nCodegen.Data["files"] = [];
  const hideDefaultLocaleInUrl = !!options.hideDefaultLocaleInUrl;

  await Promise.all(
    localesFolders.map(async (locale) => {
      const jsonFiles = await glob("**/*.json", {
        cwd: locale.path,
      });

      await Promise.all(
        jsonFiles.map(async (relativePath) => {
          const fullPath = join(locale.path, relativePath);
          const rawContent = await readFile(fullPath, "utf8");

          if (rawContent) {
            files.push({
              path: relativePath,
              data: JSON.parse(rawContent),
              locale: locale.code,
            });
          }
        }),
      );
    }),
  );

  return {
    config,
    locales,
    defaultLocale,
    hideDefaultLocaleInUrl,
    localesFolders,
    files,
    routes: getDataRoutes(config, files),
    translations: getDataTranslations(config, files),
  };
};

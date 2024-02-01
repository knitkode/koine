import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { glob } from "glob";
import { getLocalesFolders } from "./getLocalesFolders";
import { getRoutesData } from "./getRoutesData";
import type { I18nGenerate } from "./types";

export type GetFsDataOptions = Partial<I18nGenerate.Config> & {
  cwd: string;
  ignore?: string[];
};

export async function getFsData(
  options: GetFsDataOptions,
): Promise<I18nGenerate.Data> {
  const { cwd, ignore } = options;
  const localesFolders = await getLocalesFolders({
    cwd,
    ignore,
    defaultLocale: options.defaultLocale,
  });
  const locales = localesFolders.map((l) => l.code);
  const defaultLocale = options.defaultLocale || locales[0];
  const files: I18nGenerate.Data["files"] = [];

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
    locales,
    defaultLocale,
    hideDefaultLocaleInUrl: !!options.hideDefaultLocaleInUrl,
    localesFolders,
    files,
    routes: getRoutesData({ defaultLocale, files }),
  };
}

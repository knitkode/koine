import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { glob } from "glob";
import { getLocalesFolders } from "./getLocalesFolders";
import type { I18nIndexedFile, I18nIndexedLocale } from "./types";

type I18nGetFsDataOutput = {
  locales: I18nIndexedLocale[];
  files: I18nIndexedFile[];
};

export async function getFsData(options: {
  cwd: string;
  onlyFilesForLocales?: string[];
}): Promise<I18nGetFsDataOutput> {
  const { cwd, onlyFilesForLocales = [] } = options;
  let locales = await getLocalesFolders({ cwd });
  const dataOutput: I18nGetFsDataOutput = { locales, files: [] };

  if (onlyFilesForLocales.length) {
    locales = locales.filter((l) => onlyFilesForLocales.includes(l.code));
  }

  await Promise.all(
    locales.map(async (locale) => {
      const jsonFiles = await glob("**/*.json", {
        cwd: locale.path,
      });

      await Promise.all(
        jsonFiles.map(async (relativePath) => {
          const fullPath = join(locale.path, relativePath);
          const rawContent = await readFile(fullPath, "utf8");

          if (rawContent) {
            dataOutput.files.push({
              path: relativePath,
              data: JSON.parse(rawContent),
              locale: locale.code,
            });
          }
        }),
      );
    }),
  );

  return dataOutput;
}

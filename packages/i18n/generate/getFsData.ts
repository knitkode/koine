import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { glob } from "glob";
import type { I18n } from "../types";
import { getLocalesFolders } from "./getLocalesFolders";

type I18nGetFsDataOutput = {
  locales: I18n.IndexedLocale[];
  files: I18n.IndexedFile[];
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

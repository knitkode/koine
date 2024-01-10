import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { glob } from "glob";
import {
  I18nIndexedLocale,
  i18nGetLocalesFolders,
} from "./i18nGetLocalesFolders";

export type I18nIndexedFile = {
  path: string;
  locale: string;
  data: { [key: string]: any };
};

type I18nGetFsDataOutput = {
  locales: I18nIndexedLocale[];
  files: I18nIndexedFile[];
};

export async function i18nGetFsData(options: {
  cwd: string;
  onlyFilesForLocales?: string[];
}): Promise<I18nGetFsDataOutput> {
  const { cwd, onlyFilesForLocales = [] } = options;
  let locales = await i18nGetLocalesFolders({ cwd });
  const dataOutput: I18nGetFsDataOutput = { locales, files: [] };

  if (onlyFilesForLocales)
    locales = locales.filter((l) => onlyFilesForLocales.includes(l.code));

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

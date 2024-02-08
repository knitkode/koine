import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { glob } from "glob";
import type { I18nCompiler } from "../types";
import type { InputDataOptions } from "./data";

const getInputDataFsLocalesFolders = (config: InputDataOptions) => {
  const { cwd, ignore } = config;
  const folders = glob
    .sync("*", {
      cwd,
      withFileTypes: true,
      ignore: [...ignore, "node_modules/**"],
      // onlyDirectories: true,
      // @see defaults https://www.npmjs.com/package/glob#dots
      // dot: false,
    })
    .filter((folder) => folder.isDirectory())
    .map((path) => path.relative()) as I18nCompiler.Locale[];

  return folders.sort((a, b) => a.localeCompare(b));
};

export let getInputDataFs = async (
  config: InputDataOptions,
): Promise<I18nCompiler.DataInput> => {
  const localesFolders = getInputDataFsLocalesFolders(config);
  const translationFiles: I18nCompiler.DataInputTranslationFile[] = [];

  await Promise.all(
    localesFolders.map(async (locale) => {
      const jsonFiles = await glob("**/*.json", {
        cwd: join(config.cwd, locale),
        ignore: config.ignore,
      });

      await Promise.all(
        jsonFiles.map(async (relativePath) => {
          const fullPath = join(config.cwd, locale, relativePath);
          const rawContent = await readFile(fullPath, "utf8");

          if (rawContent) {
            translationFiles.push({
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
    localesFolders,
    translationFiles,
  };
};

import { readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { glob, globSync } from "glob";
import type { I18nCompiler } from "../types";
import type { InputDataLocalOptions, InputDataSharedOptions } from "./types";

const getLocalesFolders = (options: Required<InputDataLocalOptions>) => {
  const { cwd, ignore } = options;
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

export let getInputDataLocal = async (
  options: InputDataSharedOptions & InputDataLocalOptions,
): Promise<I18nCompiler.DataInput> => {
  const { cwd = process.cwd(), ignore = [], source } = options;
  const path = join(cwd, source);
  const localesFolders = getLocalesFolders({ cwd: path, ignore });
  const translationFiles: I18nCompiler.DataInputTranslationFile[] = [];

  await Promise.all(
    localesFolders.map(async (locale) => {
      const jsonFiles = await glob("**/*.json", {
        cwd: join(path, locale),
        ignore: options.ignore,
      });

      await Promise.all(
        jsonFiles.map(async (relativePath) => {
          const fullPath = join(path, locale, relativePath);
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

export let getInputDataLocalSync = (
  options: InputDataSharedOptions & InputDataLocalOptions,
): I18nCompiler.DataInput => {
  const { cwd = process.cwd(), ignore = [], source } = options;
  const path = join(cwd, source);
  const localesFolders = getLocalesFolders({ cwd: path, ignore });
  const translationFiles: I18nCompiler.DataInputTranslationFile[] = [];

  localesFolders.forEach((locale) => {
    const jsonFiles = globSync("**/*.json", {
      cwd: join(path, locale),
      ignore: options.ignore,
    });

    jsonFiles.forEach((relativePath) => {
      const fullPath = join(path, locale, relativePath);
      const rawContent = readFileSync(fullPath, "utf8");

      if (rawContent) {
        translationFiles.push({
          path: relativePath,
          data: JSON.parse(rawContent),
          locale: locale,
        });
      }
    });
  });

  return {
    localesFolders,
    translationFiles,
  };
};

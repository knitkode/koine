import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { glob } from "glob";
import { mergeObjects } from "@koine/utils";
import type { I18nCodegen } from "./types";

type GetDataFsConfig = typeof dataFsConfig;

export type GetDataFsOptions = Partial<GetDataFsConfig>;

export const dataFsConfig = {
  cwd: process.cwd(),
  ignore: [] as string[],
};

const getDataFsConfig = (options: GetDataFsOptions = {}) =>
  mergeObjects({ ...dataFsConfig }, options);

const getDataFsLocalesFolders = (config: GetDataFsConfig) => {
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
    .map((path) => path.relative()) as I18nCodegen.Locale[];

  return folders.sort((a, b) => a.localeCompare(b));
};

export let getDataFs = async (
  options?: GetDataFsOptions,
): Promise<I18nCodegen.DataFs> => {
  const config = getDataFsConfig(options);
  const localesFolders = getDataFsLocalesFolders(config);
  const translationFiles: I18nCodegen.DataFsTranslationFile[] = [];

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

import { join } from "node:path";
import { glob } from "glob";
import type { I18n } from "../types";

const ignoredFolderNames = ["node_modules"];

export async function getLocalesFolders(options: { cwd: string }) {
  const { cwd } = options;

  const folders = (
    await glob("*", {
      cwd,
      withFileTypes: true,
      // onlyDirectories: true,
      // @see defaults https://www.npmjs.com/package/glob#dots
      // dot: false,
    })
  )
    .filter((folder) => folder.isDirectory())
    .map((path) => path.relative())
    .filter((path) => !ignoredFolderNames.includes(path)) as I18n.Locale[];

  const output: I18n.IndexedLocale[] = folders.map((locale) => ({
    path: join(cwd, locale),
    code: locale,
  }));

  return output;
}
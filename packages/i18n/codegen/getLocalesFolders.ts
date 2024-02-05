import { join } from "node:path";
import { glob } from "glob";
import type { I18nCodegen } from "./types";

export let getLocalesFolders = async (options: {
  cwd: string;
  ignore?: string[];
  defaultLocale?: string;
}) => {
  const { cwd, ignore = [], defaultLocale } = options;

  const folders = (
    await glob("*", {
      cwd,
      withFileTypes: true,
      ignore: [...ignore, "node_modules/**"],
      // onlyDirectories: true,
      // @see defaults https://www.npmjs.com/package/glob#dots
      // dot: false,
    })
  )
    .filter((folder) => folder.isDirectory())
    .map((path) => path.relative()) as I18nCodegen.Locale[];

  const output: I18nCodegen.LocalesFolders[] = folders
    .sort((a, b) => (a === defaultLocale ? -1 : a.localeCompare(b)))
    .map((locale) => ({
      path: join(cwd, locale),
      code: locale,
    }));

  return output;
};

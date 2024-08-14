import { minimatch } from "minimatch";
import type { I18nCompiler } from "./types";

export const GLOBAL_I18N_IDENTIFIER = "__i18n_locale";

export let getImportDots = (folderUp = 0) =>
  (folderUp ? Array(folderUp).fill("..").join("/") : ".") + "/";

/**
 * TODO: maybe make this folder name or path configurable through options
 *
 * @param folderUp default `0`
 * @param folderName default `"translations"`
 */
export let getTranslationsDir = (folderUp = 0, folderName = "translations") => {
  return getImportDots(folderUp) + folderName;
};

/**
 * TODO: maybe use `params` to determine the right type with some kind of special
 * token used in the route id
 */
export let compileDataParamsToType = (params: I18nCompiler.DataParams) =>
  "{ " +
  Object.keys(params)
    .reduce((pairs, paramName) => {
      const value = params[paramName];
      let type = "";
      switch (value) {
        case "number":
          type = "number";
          break;
        case "string":
          type = "string";
          break;
        default:
          type = "string | number";
          break;
      }
      pairs.push(`${paramName}: ${type};`);
      return pairs;
    }, [] as string[])
    .join(" ") +
  " }";

export let escapeEachChar = (input: string) =>
  input
    .split("")
    .map((v) => `\\${v}`)
    .join("");

/**
 * @param ignore List of paths to be ignored (using `minimatch`)
 * @param otherCondition Optionally pass another condition
 * @returns
 */
export let filterInputTranslationFiles = (
  files: I18nCompiler.DataInput["translationFiles"],
  ignore: string[] = [],
  condition?: (file: I18nCompiler.DataInputTranslationFile) => boolean,
) =>
  files.filter(
    (file) =>
      (!condition || (condition && condition(file))) &&
      (!ignore.length || ignore.every((glob) => !minimatch(file.path, glob))),
  );

import type { I18nCompiler } from "./types";

export type FunctionData = {
  name: string;
  declaration: string;
  imports: string[];
};

export let getImportDir = (folderUp = 0) =>
  (folderUp ? Array(folderUp).fill("..").join("/") : ".") + "/";

/**
 * TODO: maybe make this folder name or path configurable through options
 *
 * @param folderUp default `0`
 * @param folderName default `"translations"`
 */
export let getTranslationsDir = (folderUp = 0, folderName = "translations") => {
  return getImportDir(folderUp) + folderName;
};

/**
 * TODO: maybe use `params` to determine the right type with some kind of special
 * token used in the route id
 *
 * NB: wrap the output of this function, e.g. `type A = {${dataParamsToTsInterfaceBody(params)}}`
 */
export let dataParamsToTsInterfaceBody = (params: I18nCompiler.DataParams) =>
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
    .join(" ");

export let escapeEachChar = (input: string) =>
  input
    .split("")
    .map((v) => `\\${v}`)
    .join("");

import { request } from "node:https";
import { minimatch } from "minimatch";
import type { I18nCompiler } from "../types";
import type { InputDataSharedOptions } from "./data";

const GITHUB_RAW_URL = "https://raw.githubusercontent.com";

export type InputDataRemoteSource =
  | `http${string}`
  | `${typeof GITHUB_RAW_URL}${string}`;

export type InputDataRemoteOptions = {
  /**
   * Optionally pass a list of glob patterns to ignore (checked with `minimatch`)
   */
  ignore?: string[];
};

/**
 * Our github action `knitkode/koine/actions/i18n` creates a JSON file we can
 * read here, github serves it as text
 */
export let getInputDataRemote = async (
  options: InputDataSharedOptions & InputDataRemoteOptions,
) =>
  new Promise<I18nCompiler.DataInput>((resolve, reject) => {
    const { ignore = [], source } = options;
    const isGithubUrl = source.startsWith(GITHUB_RAW_URL);
    let result = "";

    const req = request(
      source,
      isGithubUrl
        ? {}
        : {
            headers: {
              Accept: "application/json",
            },
          },
      (res) => {
        res.setEncoding("utf8");

        res.on("data", (chunk) => {
          result += chunk;
        });

        res.on("end", () => {
          try {
            const dataInput = (
              isGithubUrl ? JSON.parse(result) : result
            ) as I18nCompiler.DataInput;
            resolve({
              ...dataInput,
              localesFolders: ignore.length
                ? dataInput.localesFolders.filter((folder) =>
                    ignore.every((glob) => !minimatch(folder, glob)),
                  )
                : dataInput.localesFolders,
              translationFiles: ignore.length
                ? dataInput.translationFiles.filter((file) =>
                    ignore.every((glob) => !minimatch(file.path, glob)),
                  )
                : dataInput.translationFiles,
            });
          } catch (e) {
            throw Error(`Failed to parse JSON from ${source}`);
          }
        });
      },
    );

    req.on("error", (e) => {
      console.error(e);
      reject("");
    });

    req.end();
  });

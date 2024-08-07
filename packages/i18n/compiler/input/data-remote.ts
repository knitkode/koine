// import { execSync } from "node:child_process";
import { request } from "node:https";
import { minimatch } from "minimatch";
// import requestSync from "sync-request-curl";
// import { isString } from "@koine/utils";
import type { I18nCompiler } from "../types";
import type { InputDataRemoteOptions, InputDataSharedOptions } from "./types";

const GITHUB_RAW_URL = "https://raw.githubusercontent.com";

/**
 * Same for sync or async version
 */
const onResponseData = (
  options: InputDataSharedOptions & InputDataRemoteOptions,
  result: string,
) => {
  const { ignore = [], source } = options;

  try {
    const dataInput = JSON.parse(result) as I18nCompiler.DataInput;

    return {
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
    };
  } catch (_e) {
    throw Error(`Failed to parse JSON from ${source}`);
  }
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
          } catch (_e) {
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

/**
 * Our github action `knitkode/koine/actions/i18n` creates a JSON file we can
 * read here, github serves it as text
 */
export let getInputDataRemoteSync = (
  options: InputDataSharedOptions & InputDataRemoteOptions,
) => {
  // const { source } = options;
  // const isGithubUrl = source.startsWith(GITHUB_RAW_URL);

  // const { body } = requestSync("GET", source, {
  //   headers: isGithubUrl
  //     ? {}
  //     : {
  //         "content-type": "application/json",
  //       },
  // });

  // if (isString(body)) {
  //   return onResponseData(options, body);
  // }

  // throw Error(`sync request body is not a string from ${source}`);

  // TODO: sync fetching?
  return onResponseData(options, "{}");
};

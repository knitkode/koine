import { request } from "node:https";
import { minimatch } from "minimatch";
import { isAbsoluteUrl, isString } from "@koine/utils";
import { i18nLogger } from "../logger";
// import requestSync from "sync-request-curl";
import type { I18nCompiler } from "../types";
import type { InputDataOptions, InputDataOptionsRemote } from "./types";

const GITHUB_RAW_URL = "https://raw.githubusercontent.com";

export let isInputDataRemote = (
  data: InputDataOptions,
): data is InputDataOptionsRemote => {
  return isString(data.source) && isAbsoluteUrl(data.source);
};

/**
 * Same for sync or async version
 */
const onResponseData = (options: InputDataOptionsRemote, result: string) => {
  const { ignore = [], source } = options;

  try {
    const dataInput = JSON.parse(result) as I18nCompiler.DataInput;

    return {
      ...dataInput,
      locales: ignore.length
        ? dataInput.locales.filter((folder) =>
            ignore.every((glob) => !minimatch(folder, glob)),
          )
        : dataInput.locales,
      translationFiles: dataInput.translationFiles
        ? ignore.length
          ? dataInput.translationFiles.filter((file) =>
              ignore.every((glob) => !minimatch(file.path, glob)),
            )
          : dataInput.translationFiles
        : [],
    };
  } catch (_e) {
    throw Error(`Failed to parse JSON from ${source}`);
  }
};

/**
 * Our github action `knitkode/koine/actions/i18n` creates a JSON file we can
 * read here, github serves it as text
 */
export let getInputDataRemote = async (options: InputDataOptionsRemote) =>
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
            const dataInput = JSON.parse(result) as I18nCompiler.DataInput;
            resolve({
              ...dataInput,
              locales: ignore.length
                ? dataInput.locales.filter((folder) =>
                    ignore.every((glob) => !minimatch(folder, glob)),
                  )
                : dataInput.locales,
              translationFiles: dataInput.translationFiles
                ? ignore.length
                  ? dataInput.translationFiles.filter((file) =>
                      ignore.every((glob) => !minimatch(file.path, glob)),
                    )
                  : dataInput.translationFiles
                : [],
            });
          } catch (_e) {
            throw Error(`Failed to parse JSON from ${source}`);
          }
        });
      },
    );

    req.on("error", (e) => {
      i18nLogger.error(e);
      reject("");
    });

    req.end();
  });

/**
 * Our github action `knitkode/koine/actions/i18n` creates a JSON file we can
 * read here, github serves it as text
 */
export let getInputDataRemoteSync = (options: InputDataOptionsRemote) => {
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

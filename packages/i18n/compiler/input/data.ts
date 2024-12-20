import { isArray, objectMergeCreate, promiseAllSorted } from "@koine/utils";
import type { I18nCompiler } from "../types";
import {
  getInputDataDirect,
  getInputDataDirectSync,
  isInputDataDirect,
} from "./data-direct";
import {
  getInputDataLocal,
  getInputDataLocalSync,
  isInputDataLocal,
} from "./data-local";
import {
  getInputDataRemote,
  getInputDataRemoteSync,
  isInputDataRemote,
} from "./data-remote";
import type { InputDataOptions } from "./types";

// TODO: deep array merge for translationFiles?
const mergeDataInputs = objectMergeCreate((object, key, currentValue) => {
  if (isArray(object[key]) && isArray(currentValue)) {
    // @ts-expect-error nevermind
    object[key] = [...new Set([...currentValue, ...object[key]])];
    return true;
  }
  return false;
});

export let getInputData = async (
  options: InputDataOptions[],
): Promise<I18nCompiler.DataInput> =>
  mergeDataInputs(
    {} as I18nCompiler.DataInput,
    ...(await promiseAllSorted(
      options.map(async (option, i) => {
        if (isInputDataDirect(option)) {
          return await getInputDataDirect(option);
        }
        if (isInputDataRemote(option)) {
          return await getInputDataRemote(option);
        }
        if (isInputDataLocal(option)) {
          return await getInputDataLocal(option);
        }
        return {} as I18nCompiler.DataInput;
      }),
    )),
  );

export let getInputDataSync = (
  options: InputDataOptions[],
): I18nCompiler.DataInput => {
  return options.reduce((all, input) => {
    // throw Error(`[@koine/i18n]: Invalid 'source' option`)
    return mergeDataInputs(
      isInputDataDirect(input)
        ? getInputDataDirectSync(input)
        : isInputDataRemote(input)
          ? getInputDataRemoteSync(input)
          : isInputDataLocal(input)
            ? getInputDataLocalSync(input)
            : {},
      all,
    );
  }, {} as I18nCompiler.DataInput);
};

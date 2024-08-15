import { isArray, isFunction, isPromise, isString } from "@koine/utils";
import type { I18nCompiler } from "../types";
import type { InputDataOptions, InputDataOptionsDirect } from "./types";

export let isInputDataDirect = (
  data: InputDataOptions,
): data is InputDataOptionsDirect => {
  const { source } = data;
  return (
    isFunction(source) ||
    (!isString(source) &&
      isArray(source.localesFolders) &&
      isArray(source.translationFiles))
  );
};

export let getInputDataDirect = async (
  options: InputDataOptionsDirect,
): Promise<I18nCompiler.DataInput> => {
  const { source } = options;

  if (isFunction(source)) {
    try {
      const res = await source();
      return res;
    } catch (e) {
      console.error(e);
      throw Error("[@koine/i18n]: Failed retrieving source!");
    }
  }

  return source;
};

export let getInputDataDirectSync = (
  options: InputDataOptionsDirect,
): I18nCompiler.DataInput => {
  const { source } = options;

  if (isFunction(source)) {
    try {
      const res = source();

      if (isPromise(res)) {
        throw Error(
          "[@koine/i18n]: source needs to be a synchronous function.",
        );
      }
      return res;
    } catch (e) {
      console.error(e);
      throw Error("[@koine/i18n]: Failed retrieving source!");
    }
  }

  return source;
};

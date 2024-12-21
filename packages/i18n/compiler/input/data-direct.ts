import { isArray, isFunction, isPromise, isString } from "@koine/utils";
import { i18nLogger } from "../logger";
import type { I18nCompiler } from "../types";
import type { InputDataOptions, InputDataOptionsDirect } from "./types";

export let isInputDataDirect = (
  data: InputDataOptions,
): data is InputDataOptionsDirect => {
  const { source } = data;
  return (
    isFunction(source) ||
    (!isString(source) &&
      isArray(source.locales) &&
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
      i18nLogger.fatal("Failed retrieving source!");
      throw e;
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
        i18nLogger.fatal("source needs to be a synchronous function");
        throw Error;
      }
      return res;
    } catch (e) {
      i18nLogger.fatal("Failed retrieving source!");
      throw e;
    }
  }

  return source;
};

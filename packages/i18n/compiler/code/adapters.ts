import { isPromise, objectMergeWithDefaults } from "@koine/utils";
import adapterJs from "../../adapter-js";
import adapterNext from "../../adapter-next";
import adapterNextTranslate from "../../adapter-next-translate";
import adapterReact from "../../adapter-react";
import type { I18nCompiler } from "../types";
import {
  type CodeDataOptions,
  type CodeDataOptionsResolved,
  defaultCodeDataOptions,
} from "./data";

const getAdapterCreator = <T extends I18nCompiler.AdapterName>(name: T) => {
  switch (name) {
    case "js":
      return adapterJs;
    case "next":
      return adapterNext;
    case "next-translate":
      return adapterNextTranslate;
    case "react":
      return adapterReact;
  }
  return adapterJs;
};

/**
 */
export const getAdapter = async <T extends I18nCompiler.AdapterName>(
  data: I18nCompiler.DataCode<T>,
) => {
  const { name } = data.options.adapter;
  const adapterCreator = getAdapterCreator(name);
  // @ts-expect-error Adapter name based types
  const adapterToResolve = adapterCreator(data);
  const resolvedAdapter = adapterToResolve;
  // const resolvedAdapter = isPromise(adapterToResolve)
  //   ? await adapterToResolve
  //   : adapterToResolve;kj

  return resolvedAdapter as I18nCompiler.AdapterResolved<T>;
};

/**
 * It filters out and warn if async adapters are defined
 */
export const getAdapterSync = <T extends I18nCompiler.AdapterName>(
  data: I18nCompiler.DataCode<T>,
) => {
  const { name } = data.options.adapter;
  const adapterCreator = getAdapterCreator(name);
  // @ts-expect-error Adapter name based types
  const resolvedAdapter = adapterCreator(data);

  if (isPromise(resolvedAdapter)) {
    throw new Error(
      [
        `i18nCompiler: unsupported use of async adapter '${name}'`,
        "Please use the sync api",
      ].join("\n"),
    );
  }

  return resolvedAdapter as I18nCompiler.AdapterResolved<T>;
};

export const resolveAdapterOptions = <
  TAdapterName extends I18nCompiler.AdapterName,
>(
  codeDataOptions: CodeDataOptions,
): CodeDataOptionsResolved<TAdapterName> => {
  const { adapter } = codeDataOptions;
  const { name, options } = adapter;
  const { defaultOptions } = getAdapterCreator(name);

  return objectMergeWithDefaults(defaultCodeDataOptions, {
    ...codeDataOptions,
    adapter: {
      ...(objectMergeWithDefaults(
        defaultOptions,
        options,
      ) as I18nCompiler.AdapterConfigurationResolved<TAdapterName>),
      name,
    },
  });
};

export const getAdapterFileMeta = (
  file: Omit<I18nCompiler.AdapterFile, "content">,
  nameOverrideDictionary: Record<string, string>,
) => {
  const dir = file.dir === "." ? "" : file.dir || "";
  // allow overwriting output file names through compiler options
  const name =
    nameOverrideDictionary?.[
      file.name as keyof typeof nameOverrideDictionary
    ] || file.name;
  const path = `${dir ? dir + "/" : ""}${name}.${file.ext}`;
  return {
    dir,
    name,
    path,
  };
};

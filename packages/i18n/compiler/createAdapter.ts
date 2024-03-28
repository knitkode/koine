import {
  type PartialDeep,
  type PlainObject,
  objectMergeWithDefaults,
} from "@koine/utils";
import type { I18nCompiler } from "./types";

// /**
//  * Adapter creator function, either _sync_ or _async_
//  */
// export type AdapterCreator<T extends AdaptersName> = (
//   arg: AdapterArg<T>,
// ) => Adapter<T> | Promise<Adapter<T>>;

// /**
//  * Adapter anatomy
//  */
// export type Adapter<T extends AdaptersName = AdaptersName> = {
//   dependsOn?: AdaptersName[];
//   files: AdapterFile<T>[];
//   /**
//    * Adapters like `next-translate` need the JSON file to be available
//    */
//   needsTranslationsFiles?: boolean;
// };

export let createAdapter =
  <T extends PlainObject>(
    adapterOptionsDefaults: T,
    creator: (
      arg: I18nCompiler.DataCode & {
        adapterOptions: T;
      },
    ) => I18nCompiler.Adapter | Promise<I18nCompiler.Adapter>,
  ) =>
  (data: I18nCompiler.DataCode, adapterOptions: PartialDeep<T>) =>
    creator({
      ...data,
      adapterOptions: objectMergeWithDefaults(
        adapterOptionsDefaults,
        adapterOptions,
      ) as T,
    });

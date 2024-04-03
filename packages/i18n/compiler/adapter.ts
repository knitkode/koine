import {
  type PlainObject,
  type RequiredDeep,
  objectMergeWithDefaults,
} from "@koine/utils";
import type { I18nCompiler } from "./types";

export abstract class Adapter<
  TName extends I18nCompiler.AdaptersName,
  TOptions extends PlainObject,
  // TOptionsResolved extends PlainObject = RequiredDeep<TOptions>,
> {
  name!: TName;
  defaults!: RequiredDeep<TOptions>;
  options: RequiredDeep<TOptions>;
  // options /* : TOptionsResolved */;

  constructor(options: TOptions /* : TOptions */) {
    // this.options = objectMergeWithDefaults(this.getDefaults(), options);
    this.options = this.getOpts(this.defaults, options);
  }

  getOpts(defaults: RequiredDeep<TOptions>, custom: TOptions) {
    return objectMergeWithDefaults(defaults, custom) as RequiredDeep<TOptions>;
  }

  // abstract getDefaults(); /* : TOptionsResolved */

  abstract getFiles(): I18nCompiler.AdapterFile<TName>[];
  // getFiles(): I18nCompiler.AdapterFile<TName>[] {
  //   return [];
  // }

  // static dependsOn: I18nCompiler.Adapter
}

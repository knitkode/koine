import { createSyncFn } from "synckit";
import type { I18nCompilerOptions, I18nCompilerReturn } from "./compiler/api";

export let i18nCompilerSync = createSyncFn(
  require.resolve("./compiler-worker.cjs"),
) as (options: I18nCompilerOptions) => I18nCompilerReturn;

export {
  type I18nCompilerOptions,
  type I18nCompilerReturn,
} from "./compiler/api";
export type { I18nCompiler } from "./compiler/types";

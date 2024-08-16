export {
  i18nCompiler,
  // NOTE: do not export the sync version as the automatic syncing done by
  // synckit seem to work well and it allows for features parity between
  // sync/async version of the compiler. The sync implementation is still being
  // kept and developed to avoid vendor lock-in in case synckit would stop
  // working
  // i18nCompilerSync,
  type I18nCompilerOptions,
  type I18nCompilerReturn,
} from "./compiler/api";
export type { I18nCompiler } from "./compiler/types";

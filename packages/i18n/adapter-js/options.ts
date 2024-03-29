export const adapterJsOptions: AdapterJsOptions = {
  modularized: true,
};

export type AdapterJsOptions = {
  /**
   * - When `true` it outpus each function in a separate file with a `named` and a
   * `default` export in order to fully support SWC modularizeImport optimization.
   * You will use these functions with named exports from `@/i18n/t`, e.g.
   * ```ts
   * import { myMessage_key } from "@/i18n/t";
   *
   * myMessage_key();
   * ```
   * This import is transformed into `import myMessage_key from "@/i18n/t/myMessage_key";`
   *
   *
   * - When `false` usage is:
   * ```ts
   * import { t } from "@/i18n";
   *
   * t.myMessage_key();
   * ```
   *
   * @default true
   */
  modularized: boolean;
};

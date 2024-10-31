import type { PickDeep } from "@koine/utils";
import { swcCreateTransform } from "@koine/node/swc";
import type { CodeDataOptionsResolved } from "./code";

/**
 * Automatically create swc transforms based on given options
 */
export let createSwcTransforms = (
  resolvedOptions: PickDeep<
    CodeDataOptionsResolved,
    // | "routes.functions.dir"
    // | "translations.functions.dir"
    "write.tsconfig"
  >,
) => {
  const { /* routes, translations, */ write } = resolvedOptions;
  const alias = write?.tsconfig ? write.tsconfig.alias : "";

  return {
    ...swcCreateTransform({ path: "@koine/i18n" }),
    ...(alias ? swcCreateTransform({ path: alias }) : {}),
    // these are not needed as @/i18n/{non flat regex} will already account
    // for translations and routes functions SWC transform modularization
    // ...(translations?.functions.dir
    //   ? swcCreateTransform({
    //       path: `@/${translations.functions.dir}`,
    //       flat: true,
    //     })
    //   : {}),
    // ...(routes?.functions.dir
    //   ? swcCreateTransform({
    //       path: `@/${routes.functions.dir}`,
    //       flat: true,
    //     })
    //   : {}),
  };
};

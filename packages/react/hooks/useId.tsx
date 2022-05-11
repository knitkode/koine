import { uid } from "@koine/utils";

/**
 * FIXME: once we can move to react 18 just replace this import with `{ useId } from "react";`
 */
export function useId(prefix = "uid") {
  return `${prefix}-${uid()}`;
}

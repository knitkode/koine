import { useEffect, useLayoutEffect } from "react";
import { isBrowser } from "@koine/utils";

/**
 * @borrows [streamich/react-use](https://github.com/streamich/react-use/blob/master/src/useFirstMountState.ts)
 */

export const useIsomorphicLayoutEffect = isBrowser
  ? useLayoutEffect
  : useEffect;

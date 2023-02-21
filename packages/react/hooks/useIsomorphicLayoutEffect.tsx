import { useEffect, useLayoutEffect } from "react";
import isBrowser from "@koine/utils/isBrowser";

/**
 * @borrows [streamich/react-use](https://github.com/streamich/react-use/blob/master/src/useIsomorphicLayoutEffect.ts)
 */

export const useIsomorphicLayoutEffect = isBrowser
  ? useLayoutEffect
  : useEffect;

export default useIsomorphicLayoutEffect;

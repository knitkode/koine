import { useEffect } from "react";
import { useFirstMountState } from "./useFirstMountState";

/**
 * @borrows [streamich/react-use](https://github.com/streamich/react-use/blob/master/src/useUpdateEffect.ts)
 */
export const useUpdateEffect: typeof useEffect = (effect, deps) => {
  const isFirstMount = useFirstMountState();

  useEffect(() => {
    if (!isFirstMount) {
      return effect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

export default useUpdateEffect;

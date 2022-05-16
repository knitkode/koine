import React, { useEffect } from "react";

/**
 * @borrows [streamich/react-use](https://github.com/streamich/react-use/blob/master/src/useEffectOnce.ts)
 */
export const useEffectOnce = (effect: React.EffectCallback) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, []);
};

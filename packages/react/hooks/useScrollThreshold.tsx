import { useCallback, useEffect, useState } from "react";
import { noop } from "@koine/utils";
import { /* listenScroll, */ on } from "@koine/dom";

export const useScrollThreshold = (
  threshold?: number,
  callback?: (isAbove: boolean, isBelow: boolean) => void
) => {
  const [isBelow, setIsBelow] = useState(false);

  const handler = useCallback(() => {
    if (threshold) {
      const posY = window.scrollY; // * -1;
      const isAbove = posY < threshold;
      const isBelow = posY > threshold;

      // console.log("useScrollThreshold setIsBelow", isBelow, posY, threshold);
      setIsBelow(isBelow);

      if (callback) callback(isAbove, isBelow);
    }
  }, [threshold, callback]);

  useEffect(() => {
    if (threshold) {
      // const listener = listenScroll(handler, 50);
      const listener = on(window, "scroll", handler, { passive: true });

      handler();

      return listener;
    }

    return noop;
  }, [threshold, handler]);

  return isBelow;
};

export default useScrollThreshold;

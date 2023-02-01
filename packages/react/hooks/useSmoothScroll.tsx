import { useCallback } from "react";
import { isNumber } from "@koine/utils";
import { getOffsetTopSlim, scrollTo } from "@koine/dom";
import { useFixedOffset } from "./useFixedOffset";

export function useSmoothScroll(disregardAutomaticFixedOffset?: boolean) {
  const fixedOffset = useFixedOffset();

  const scroll = useCallback(
    (
      to?: number | string,
      customOffset?: number,
      callback?: () => void,
      fallbackTimeout?: number,
      behavior?: ScrollBehavior
    ) => {
      let top: number | undefined = undefined;

      if (isNumber(to)) {
        top = to;
      } else if (to) {
        const el = document.getElementById(to);
        if (el) {
          top = getOffsetTopSlim(el);
        }
      }

      if (isNumber(top)) {
        top =
          top +
          (customOffset || 0) +
          (disregardAutomaticFixedOffset ? 0 : fixedOffset.current);

        scrollTo(top, callback, fallbackTimeout, behavior);
      }
    },
    [disregardAutomaticFixedOffset, fixedOffset]
  );

  return scroll;
}

export default useSmoothScroll;

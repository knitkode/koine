import { useCallback } from "react";
import { isNumber } from "@koine/utils";
import { scrollTo } from "@koine/dom";
import { useFixedOffset } from "./useFixedOffset";

export function useSmoothScroll() {
  const fixedOffset = useFixedOffset();

  const scroll = useCallback(
    (
      to?: number | string,
      offset = 0,
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
          top = el.getBoundingClientRect().top;
        }
      }

      if (isNumber(top)) {
        top = top + window.scrollY - (fixedOffset.current + offset);

        scrollTo(top, callback, fallbackTimeout, behavior);
      }
    },
    [fixedOffset]
  );

  return scroll;
}

export default useSmoothScroll;

import { useLayoutEffect, useRef } from "react";
import {
  injectCss,
  calculateFixedOffset,
  listenResize,
  $each,
} from "@koine/dom";
import { debounce } from "@koine/utils";

let observer: ResizeObserver | undefined;

const inject = (value: number) => {
  injectCss("useFixedOffset", `html{scroll-padding-top: ${value}px}`);
};

/**
 * Maybe use [ResizeObserver polyfill](https://github.com/juggle/resize-observer)
 *
 * @see https://web.dev/resize-observer/
 */
export function useFixedOffset() {
  const fixedOffset = useRef<number>(0);

  useLayoutEffect(() => {
    const update = () => {
      const newFixedOffset = calculateFixedOffset();
      fixedOffset.current = newFixedOffset;
      // inject this CSS make the hashed deeplinks position the scroll at the
      // right offset
      inject(newFixedOffset);
    };

    update();

    if (!observer && ResizeObserver) {
      // const elements = $$("[data-fixed]");

      observer = new ResizeObserver((entries) => {
        let newFixedOffset = 0;

        entries.forEach((entry) => {
          newFixedOffset += entry.contentRect.height;
        });
        fixedOffset.current = newFixedOffset;
        const updateOnResize = debounce(() => inject(newFixedOffset), 400);
        updateOnResize();
      });

      $each("[data-fixed]", ($el) => {
        if (observer) observer.observe($el);
      });

      return () => {
        observer?.disconnect();
      };
    } else {
      const listener = listenResize(update);
      return listener;
    }
  }, []);

  return fixedOffset;
}

export default useFixedOffset;
